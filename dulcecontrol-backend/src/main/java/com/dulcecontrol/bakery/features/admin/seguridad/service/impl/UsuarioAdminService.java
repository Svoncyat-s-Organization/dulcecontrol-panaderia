package com.dulcecontrol.bakery.features.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.features.admin.configuracion.repository.SedeAdminRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioUpdateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.Rol;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSede;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSedeId;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.RolRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioSedeRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.service.IUsuarioAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.dulcecontrol.bakery.features.shared.suscripciones.model.PlanLimites;
import com.dulcecontrol.bakery.features.shared.suscripciones.service.PlanLimitesService;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioAdminService implements IUsuarioAdminService {

    private final UsuarioTiendaRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioSedeRepository usuarioSedeRepository;
    private final SedeAdminRepository sedeAdminRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PlanLimitesService planLimitesService;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarPorTienda(Long tiendaId) {
        List<UsuarioTienda> usuarios = usuarioRepository.findAllIncludingInactiveByTiendaId(tiendaId);
        Map<Long, Rol> roles = rolRepository.findByTiendaId(tiendaId)
                .stream()
                .collect(Collectors.toMap(Rol::getId, Function.identity()));

        Map<Long, List<UsuarioSede>> asignaciones = obtenerAsignacionesPorUsuario(usuarios);
        Map<Long, Sede> sedes = cargarSedesPorAsignaciones(asignaciones);

        return usuarios.stream()
                .map(usuario -> {
                    Rol rol = roles.get(usuario.getRolId());
                    List<UsuarioSede> usuarioSedes = asignaciones.getOrDefault(usuario.getId(), Collections.emptyList());
                    return toResponse(usuario, rol, usuarioSedes, sedes);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findIncludingInactiveByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Rol rol = rolRepository.findById(usuario.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        List<UsuarioSede> asignaciones = usuarioSedeRepository.findByIdUsuarioId(usuarioId);
        Map<Long, Sede> sedes = cargarSedesDetalle(tiendaId, asignaciones);
        return toResponse(usuario, rol, asignaciones, sedes);
    }

    @Override
    @Transactional
    public UsuarioResponse crear(Long tiendaId, UsuarioCreateRequest request) {
        validarRolPerteneceATienda(request.getRolId(), tiendaId);
        validarDuplicadosAlCrear(tiendaId, request.getCorreo(), request.getNumeroDoc());
        validarLimiteUsuarios(tiendaId);
        List<Long> sedeIds = normalizarSedeIds(request.getSedeIds());
        if (sedeIds.isEmpty()) {
            throw new BadRequestException("Debes asignar al menos una sede");
        }
        List<Sede> sedesSeleccionadas = validarSedesPertenecenATienda(tiendaId, sedeIds);
        Map<Long, Sede> sedesDetalle = sedesSeleccionadas.stream()
                .collect(Collectors.toMap(Sede::getId, Function.identity()));

        UsuarioTienda usuario = new UsuarioTienda();
        usuario.setTiendaId(tiendaId);
        usuario.setRolId(request.getRolId());
        usuario.setCorreo(request.getCorreo().toLowerCase());
        usuario.setHashContrasena(passwordEncoder.encode(request.getContrasena()));
        usuario.setTipoDoc(request.getTipoDoc());
        usuario.setNumeroDoc(request.getNumeroDoc());
        usuario.setNombres(request.getNombres());
        usuario.setTelefono(request.getTelefono());
        usuario.setActivo(Boolean.TRUE);

        UsuarioTienda guardado = usuarioRepository.save(usuario);
        List<UsuarioSede> asignaciones = sincronizarSedesAsignadas(guardado.getId(), sedesSeleccionadas);
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras crear"));
        return toResponse(guardado, rol, asignaciones, sedesDetalle);
    }

    private void validarLimiteUsuarios(Long tiendaId) {
        PlanLimites limites = planLimitesService.obtenerLimitesVigentes(tiendaId);
        if (!limites.tieneLimiteUsuarios()) {
            return;
        }

        long usuariosActivos = usuarioRepository.countByTiendaId(tiendaId);
        if (usuariosActivos >= limites.getMaxUsuarios()) {
            throw new BadRequestException(
                    String.format(
                            "Tu plan permite hasta %d usuarios activos. Actualiza tu suscripción para habilitar más accesos.",
                            limites.getMaxUsuarios()));
        }
    }

    @Override
    @Transactional
    public UsuarioResponse actualizar(Long tiendaId, Long usuarioId, UsuarioUpdateRequest request) {
        UsuarioTienda usuario = usuarioRepository.findIncludingInactiveByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        validarRolPerteneceATienda(request.getRolId(), tiendaId);
        List<Long> sedeIds = normalizarSedeIds(request.getSedeIds());
        if (sedeIds.isEmpty()) {
            throw new BadRequestException("Debes asignar al menos una sede");
        }
        List<Sede> sedesSeleccionadas = validarSedesPertenecenATienda(tiendaId, sedeIds);
        Map<Long, Sede> sedesDetalle = sedesSeleccionadas.stream()
            .collect(Collectors.toMap(Sede::getId, Function.identity()));

        String correoNormalizado = request.getCorreo().toLowerCase();
        if (!usuario.getCorreo().equalsIgnoreCase(request.getCorreo()) &&
            usuarioRepository.existsByTiendaIdAndCorreoAndIdNot(tiendaId, correoNormalizado, usuarioId)) {
            throw new BadRequestException("El correo ya está registrado para esta tienda");
        }

        if (!usuario.getNumeroDoc().equals(request.getNumeroDoc()) &&
                usuarioRepository.existsByTiendaIdAndNumeroDocAndIdNot(tiendaId, request.getNumeroDoc(), usuarioId)) {
            throw new BadRequestException("El documento ya está registrado para esta tienda");
        }

        usuario.setRolId(request.getRolId());
        usuario.setCorreo(correoNormalizado);
        usuario.setTipoDoc(request.getTipoDoc());
        usuario.setNumeroDoc(request.getNumeroDoc());
        usuario.setNombres(request.getNombres());
        usuario.setTelefono(request.getTelefono());

        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }

        if (request.getNuevaContrasena() != null && !request.getNuevaContrasena().isBlank()) {
            usuario.setHashContrasena(passwordEncoder.encode(request.getNuevaContrasena()));
        }

        UsuarioTienda actualizado = usuarioRepository.save(usuario);
        List<UsuarioSede> asignaciones = sincronizarSedesAsignadas(actualizado.getId(), sedesSeleccionadas);
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras actualizar"));
        return toResponse(actualizado, rol, asignaciones, sedesDetalle);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findIncludingInactiveByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
        usuarioSedeRepository.deleteByIdUsuarioId(usuarioId);
    }

    private void validarRolPerteneceATienda(Long rolId, Long tiendaId) {
        rolRepository.findByIdAndTiendaId(rolId, tiendaId)
                .orElseThrow(() -> new BadRequestException("El rol no pertenece a la tienda"));
    }

    private void validarDuplicadosAlCrear(Long tiendaId, String correo, String numeroDoc) {
        String correoNormalizado = correo != null ? correo.toLowerCase() : null;
        if (correoNormalizado != null && usuarioRepository.existsByTiendaIdAndCorreo(tiendaId, correoNormalizado)) {
            throw new BadRequestException("El correo ya está registrado para esta tienda");
        }
        if (usuarioRepository.existsByTiendaIdAndNumeroDoc(tiendaId, numeroDoc)) {
            throw new BadRequestException("El documento ya está registrado para esta tienda");
        }
    }

    private UsuarioResponse toResponse(UsuarioTienda usuario, Rol rol, List<UsuarioSede> asignaciones,
            Map<Long, Sede> sedesDetalle) {
        List<UsuarioSede> ordenadas = ordenarAsignaciones(asignaciones);
        List<Long> sedeIds = ordenadas.stream()
                .map(asignacion -> asignacion.getId().getSedeId())
                .toList();

        List<String> sedeNombres = sedeIds.stream()
                .map(sedeId -> Optional.ofNullable(sedesDetalle.get(sedeId)).map(Sede::getNombre).orElse(null))
                .toList();

        Long sedePrincipalId = ordenadas.stream()
                .filter(asignacion -> Boolean.TRUE.equals(asignacion.getEsSedePrincipal()))
                .map(asignacion -> asignacion.getId().getSedeId())
                .findFirst()
                .orElseGet(() -> sedeIds.isEmpty() ? null : sedeIds.get(0));

        String sedePrincipalNombre = sedePrincipalId != null
                ? Optional.ofNullable(sedesDetalle.get(sedePrincipalId)).map(Sede::getNombre).orElse(null)
                : null;

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .tiendaId(usuario.getTiendaId())
                .rolId(usuario.getRolId())
                .rolNombre(rol != null ? rol.getNombre() : null)
                .sedeId(sedePrincipalId)
                .sedeNombre(sedePrincipalNombre)
                .sedeIds(sedeIds)
                .sedes(sedeNombres)
                .correo(usuario.getCorreo())
                .tipoDoc(usuario.getTipoDoc())
                .numeroDoc(usuario.getNumeroDoc())
                .nombres(usuario.getNombres())
                .telefono(usuario.getTelefono())
                .activo(usuario.getActivo())
                .ultimoAccesoEn(usuario.getUltimoAccesoEn())
                .creadoEn(usuario.getCreadoEn())
                .build();
    }

    private Map<Long, List<UsuarioSede>> obtenerAsignacionesPorUsuario(List<UsuarioTienda> usuarios) {
        if (usuarios.isEmpty()) {
            return Map.of();
        }

        List<Long> usuarioIds = usuarios.stream()
                .map(UsuarioTienda::getId)
                .toList();

        List<UsuarioSede> asignaciones = usuarioSedeRepository.findByIdUsuarioIdIn(usuarioIds);
        return asignaciones.stream()
                .collect(Collectors.groupingBy(asignacion -> asignacion.getId().getUsuarioId()));
    }

    private Map<Long, Sede> cargarSedesPorAsignaciones(Map<Long, List<UsuarioSede>> asignaciones) {
        if (asignaciones.isEmpty()) {
            return Map.of();
        }

        Set<Long> sedeIds = asignaciones.values().stream()
                .filter(Objects::nonNull)
                .flatMap(lista -> lista.stream().map(asignacion -> asignacion.getId().getSedeId()))
                .collect(Collectors.toSet());

        if (sedeIds.isEmpty()) {
            return Map.of();
        }

        return sedeAdminRepository.findAllById(sedeIds).stream()
                .collect(Collectors.toMap(Sede::getId, Function.identity()));
    }

    private Map<Long, Sede> cargarSedesDetalle(Long tiendaId, List<UsuarioSede> asignaciones) {
        if (asignaciones == null || asignaciones.isEmpty()) {
            return Map.of();
        }

        Set<Long> sedeIds = asignaciones.stream()
                .map(asignacion -> asignacion.getId().getSedeId())
                .collect(Collectors.toSet());

        if (sedeIds.isEmpty()) {
            return Map.of();
        }

        return sedeAdminRepository.findAllById(sedeIds).stream()
                .filter(sede -> sede != null && sede.getTienda() != null
                        && Objects.equals(sede.getTienda().getId(), tiendaId))
                .collect(Collectors.toMap(Sede::getId, Function.identity()));
    }

    private List<Long> normalizarSedeIds(List<Long> sedeIds) {
        if (sedeIds == null || sedeIds.isEmpty()) {
            return Collections.emptyList();
        }
        LinkedHashSet<Long> unique = sedeIds.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        return new ArrayList<>(unique);
    }

    private List<Sede> validarSedesPertenecenATienda(Long tiendaId, List<Long> sedeIds) {
        if (sedeIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<Sede> sedes = sedeAdminRepository.findAllById(sedeIds);
        Map<Long, Sede> sedesPorId = sedes.stream()
                .collect(Collectors.toMap(Sede::getId, Function.identity()));

        for (Long sedeId : sedeIds) {
            Sede sede = sedesPorId.get(sedeId);
            if (sede == null || sede.getTienda() == null || !Objects.equals(sede.getTienda().getId(), tiendaId)) {
                throw new BadRequestException("La sede seleccionada no pertenece a la tienda");
            }
        }

        return sedeIds.stream()
                .map(sedesPorId::get)
                .collect(Collectors.toList());
    }

    private List<UsuarioSede> sincronizarSedesAsignadas(Long usuarioId, List<Sede> sedesSeleccionadas) {
        usuarioSedeRepository.deleteByIdUsuarioId(usuarioId);

        if (sedesSeleccionadas == null || sedesSeleccionadas.isEmpty()) {
            return Collections.emptyList();
        }

        Long sedePrincipalId = sedesSeleccionadas.get(0).getId();
        List<UsuarioSede> resultado = new ArrayList<>();

        for (Sede sede : sedesSeleccionadas) {
            UsuarioSede usuarioSede = new UsuarioSede();
            usuarioSede.setId(new UsuarioSedeId(usuarioId, sede.getId()));
            usuarioSede.setEsSedePrincipal(Objects.equals(sede.getId(), sedePrincipalId));
            resultado.add(usuarioSedeRepository.save(usuarioSede));
        }

        return resultado;
    }

    private List<UsuarioSede> ordenarAsignaciones(List<UsuarioSede> asignaciones) {
        if (asignaciones == null || asignaciones.isEmpty()) {
            return Collections.emptyList();
        }

        return asignaciones.stream()
                .sorted(Comparator
                        .comparing((UsuarioSede asignacion) -> Boolean.TRUE.equals(asignacion.getEsSedePrincipal()) ? 0 : 1)
                        .thenComparing(asignacion -> asignacion.getId().getSedeId()))
                .toList();
    }
}

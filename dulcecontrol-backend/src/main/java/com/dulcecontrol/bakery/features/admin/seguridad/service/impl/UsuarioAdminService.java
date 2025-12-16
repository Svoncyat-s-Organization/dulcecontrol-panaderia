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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        List<UsuarioTienda> usuarios = usuarioRepository.findByTiendaId(tiendaId);
        Map<Long, Rol> roles = rolRepository.findByTiendaId(tiendaId)
                .stream()
                .collect(Collectors.toMap(Rol::getId, Function.identity()));

        Map<Long, UsuarioSede> asignaciones = obtenerAsignacionPrincipalPorUsuario(usuarios);
        Map<Long, Sede> sedes = cargarSedesPorAsignacion(asignaciones);

        return usuarios.stream()
                .map(usuario -> {
                    Rol rol = roles.get(usuario.getRolId());
                    UsuarioSede asignacion = asignaciones.get(usuario.getId());
                    Sede sede = asignacion != null ? sedes.get(asignacion.getId().getSedeId()) : null;
                    return toResponse(usuario, rol, asignacion, sede);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Rol rol = rolRepository.findById(usuario.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        UsuarioSede asignacion = obtenerAsignacionPrincipal(usuarioId);
        Sede sede = asignacion != null
            ? sedeAdminRepository.findByIdAndTiendaId(asignacion.getId().getSedeId(), tiendaId).orElse(null)
            : null;
        return toResponse(usuario, rol, asignacion, sede);
    }

    @Override
    @Transactional
    public UsuarioResponse crear(Long tiendaId, UsuarioCreateRequest request) {
        validarRolPerteneceATienda(request.getRolId(), tiendaId);
        validarDuplicadosAlCrear(tiendaId, request.getCorreo(), request.getNumeroDoc());
        validarLimiteUsuarios(tiendaId);
        Sede sede = validarSedePerteneceATienda(tiendaId, request.getSedeId());

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
        UsuarioSede asignacion = asignarSedePrincipal(guardado.getId(), sede);
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras crear"));
        return toResponse(guardado, rol, asignacion, sede);
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
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        validarRolPerteneceATienda(request.getRolId(), tiendaId);
        Sede sede = validarSedePerteneceATienda(tiendaId, request.getSedeId());

        if (!usuario.getCorreo().equalsIgnoreCase(request.getCorreo()) &&
                usuarioRepository.existsByTiendaIdAndCorreoAndIdNot(tiendaId, request.getCorreo(), usuarioId)) {
            throw new BadRequestException("El correo ya está registrado para esta tienda");
        }

        if (!usuario.getNumeroDoc().equals(request.getNumeroDoc()) &&
                usuarioRepository.existsByTiendaIdAndNumeroDocAndIdNot(tiendaId, request.getNumeroDoc(), usuarioId)) {
            throw new BadRequestException("El documento ya está registrado para esta tienda");
        }

        usuario.setRolId(request.getRolId());
        usuario.setCorreo(request.getCorreo().toLowerCase());
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
        UsuarioSede asignacion = asignarSedePrincipal(actualizado.getId(), sede);
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras actualizar"));
        return toResponse(actualizado, rol, asignacion, sede);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
        usuarioSedeRepository.deleteByIdUsuarioId(usuarioId);
    }

    private void validarRolPerteneceATienda(Long rolId, Long tiendaId) {
        rolRepository.findByIdAndTiendaId(rolId, tiendaId)
                .orElseThrow(() -> new BadRequestException("El rol no pertenece a la tienda"));
    }

    private void validarDuplicadosAlCrear(Long tiendaId, String correo, String numeroDoc) {
        if (usuarioRepository.existsByTiendaIdAndCorreo(tiendaId, correo)) {
            throw new BadRequestException("El correo ya está registrado para esta tienda");
        }
        if (usuarioRepository.existsByTiendaIdAndNumeroDoc(tiendaId, numeroDoc)) {
            throw new BadRequestException("El documento ya está registrado para esta tienda");
        }
    }

    private UsuarioResponse toResponse(UsuarioTienda usuario, Rol rol, UsuarioSede usuarioSede, Sede sede) {
        Long sedeId = null;
        if (usuarioSede != null && usuarioSede.getId() != null) {
            sedeId = usuarioSede.getId().getSedeId();
        }
        if (sede != null && sedeId == null) {
            sedeId = sede.getId();
        }

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .tiendaId(usuario.getTiendaId())
                .rolId(usuario.getRolId())
                .rolNombre(rol != null ? rol.getNombre() : null)
                .sedeId(sedeId)
                .sedeNombre(sede != null ? sede.getNombre() : null)
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

    private Map<Long, UsuarioSede> obtenerAsignacionPrincipalPorUsuario(List<UsuarioTienda> usuarios) {
        if (usuarios.isEmpty()) {
            return Map.of();
        }

        List<Long> usuarioIds = usuarios.stream()
                .map(UsuarioTienda::getId)
                .toList();

        List<UsuarioSede> asignaciones = usuarioSedeRepository.findByIdUsuarioIdIn(usuarioIds);
        return asignaciones.stream()
                .collect(Collectors.toMap(
                        asignacion -> asignacion.getId().getUsuarioId(),
                        Function.identity(),
                        this::preferirPrincipal));
    }

    private Map<Long, Sede> cargarSedesPorAsignacion(Map<Long, UsuarioSede> asignaciones) {
        if (asignaciones.isEmpty()) {
            return Map.of();
        }

        List<Long> sedeIds = asignaciones.values().stream()
                .filter(asignacion -> asignacion != null && asignacion.getId() != null)
                .map(asignacion -> asignacion.getId().getSedeId())
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Sede> sedesPorId = sedeAdminRepository.findAllById(sedeIds).stream()
                .collect(Collectors.toMap(Sede::getId, Function.identity()));

        Map<Long, Sede> resultado = new HashMap<>();
        asignaciones.forEach((usuarioId, asignacion) -> {
            if (asignacion != null && asignacion.getId() != null) {
                resultado.put(usuarioId, sedesPorId.get(asignacion.getId().getSedeId()));
            }
        });
        return resultado;
    }

    private UsuarioSede obtenerAsignacionPrincipal(Long usuarioId) {
        List<UsuarioSede> asignaciones = usuarioSedeRepository.findByIdUsuarioId(usuarioId);
        return asignaciones.stream().reduce(this::preferirPrincipal).orElse(null);
    }

    private UsuarioSede preferirPrincipal(UsuarioSede actual, UsuarioSede candidato) {
        if (actual == null) {
            return candidato;
        }
        if (candidato == null) {
            return actual;
        }
        if (Boolean.TRUE.equals(candidato.getEsSedePrincipal())) {
            return candidato;
        }
        if (Boolean.TRUE.equals(actual.getEsSedePrincipal())) {
            return actual;
        }
        return actual;
    }

    private Sede validarSedePerteneceATienda(Long tiendaId, Long sedeId) {
        if (sedeId == null) {
            throw new BadRequestException("Debe seleccionar una sede");
        }
        return sedeAdminRepository.findByIdAndTiendaId(sedeId, tiendaId)
                .orElseThrow(() -> new BadRequestException("La sede seleccionada no pertenece a la tienda"));
    }

    private UsuarioSede asignarSedePrincipal(Long usuarioId, Sede sede) {
        if (sede == null) {
            usuarioSedeRepository.deleteByIdUsuarioId(usuarioId);
            return null;
        }

        List<UsuarioSede> asignaciones = usuarioSedeRepository.findByIdUsuarioId(usuarioId);
        UsuarioSede principal = null;

        for (UsuarioSede asignacion : asignaciones) {
            boolean esPrincipalSeleccionada = asignacion.getId().getSedeId().equals(sede.getId());
            boolean estadoActual = Boolean.TRUE.equals(asignacion.getEsSedePrincipal());
            if (estadoActual != esPrincipalSeleccionada) {
                asignacion.setEsSedePrincipal(esPrincipalSeleccionada);
                usuarioSedeRepository.save(asignacion);
            }
            if (esPrincipalSeleccionada) {
                principal = asignacion;
            }
        }

        if (principal == null) {
            UsuarioSede nueva = new UsuarioSede();
            nueva.setId(new UsuarioSedeId(usuarioId, sede.getId()));
            nueva.setEsSedePrincipal(Boolean.TRUE);
            principal = usuarioSedeRepository.save(nueva);
        }

        return principal;
    }
}

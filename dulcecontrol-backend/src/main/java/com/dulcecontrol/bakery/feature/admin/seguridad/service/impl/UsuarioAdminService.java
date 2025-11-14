package com.dulcecontrol.bakery.feature.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.admin.seguridad.dto.UsuarioCreateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.dto.UsuarioResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.dto.UsuarioUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.Rol;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioTienda;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.RolRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IUsuarioAdminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioAdminService implements IUsuarioAdminService {

    private final UsuarioTiendaRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarPorTienda(Long tiendaId) {
        List<UsuarioTienda> usuarios = usuarioRepository.findByTiendaId(tiendaId);
        Map<Long, Rol> roles = rolRepository.findByTiendaId(tiendaId)
                .stream()
                .collect(Collectors.toMap(Rol::getId, Function.identity()));

        return usuarios.stream()
                .map(usuario -> toResponse(usuario, roles.get(usuario.getRolId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public UsuarioResponse obtenerPorId(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Rol rol = rolRepository.findById(usuario.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        return toResponse(usuario, rol);
    }

    @Override
    @Transactional
    public UsuarioResponse crear(Long tiendaId, UsuarioCreateRequest request) {
        validarRolPerteneceATienda(request.getRolId(), tiendaId);
        validarDuplicadosAlCrear(tiendaId, request.getCorreo(), request.getNumeroDoc());

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
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras crear"));
        return toResponse(guardado, rol);
    }

    @Override
    @Transactional
    public UsuarioResponse actualizar(Long tiendaId, Long usuarioId, UsuarioUpdateRequest request) {
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        validarRolPerteneceATienda(request.getRolId(), tiendaId);

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
        Rol rol = rolRepository.findById(request.getRolId())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado tras actualizar"));
        return toResponse(actualizado, rol);
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long usuarioId) {
        UsuarioTienda usuario = usuarioRepository.findByIdAndTiendaId(usuarioId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
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

    private UsuarioResponse toResponse(UsuarioTienda usuario, Rol rol) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .tiendaId(usuario.getTiendaId())
                .rolId(usuario.getRolId())
                .rolNombre(rol != null ? rol.getNombre() : null)
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
}

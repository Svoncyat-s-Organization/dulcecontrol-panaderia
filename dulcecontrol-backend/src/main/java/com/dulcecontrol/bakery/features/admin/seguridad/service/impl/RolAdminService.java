package com.dulcecontrol.bakery.features.admin.seguridad.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.RolCreateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.RolResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.RolUpdateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.Permiso;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.Rol;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.PermisoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.RolPermisoRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.RolRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.features.admin.seguridad.service.IRolAdminService;
import com.dulcecontrol.bakery.features.admin.seguridad.service.RolSistemaBootstrapService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RolAdminService implements IRolAdminService {

    private final RolRepository rolRepository;
    private final PermisoRepository permisoRepository;
    private final RolPermisoRepository rolPermisoRepository;
    private final UsuarioTiendaRepository usuarioTiendaRepository;
    private final RolSistemaBootstrapService rolSistemaBootstrapService;

    @Override
    @Transactional
    public List<RolResponse> listarPorTienda(Long tiendaId) {
        rolSistemaBootstrapService.ensureDefaultRoles(tiendaId);
        return rolRepository.findByTiendaId(tiendaId)
                .stream()
                .map(rol -> toResponse(rol, new HashSet<>(rolPermisoRepository.findPermisoIdsByRolId(rol.getId()))))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RolResponse obtenerPorId(Long tiendaId, Long rolId) {
        Rol rol = rolRepository.findByIdAndTiendaId(rolId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));
        Set<Long> permisos = new HashSet<>(rolPermisoRepository.findPermisoIdsByRolId(rol.getId()));
        return toResponse(rol, permisos);
    }

    @Override
    @Transactional
    public RolResponse crear(Long tiendaId, RolCreateRequest request) {
        if (rolRepository.existsByTiendaIdAndNombre(tiendaId, request.getNombre())) {
            throw new BadRequestException("Ya existe un rol con ese nombre");
        }

        Rol rol = new Rol();
        rol.setTiendaId(tiendaId);
        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());
        rol.setEsSistema(Boolean.FALSE);

        Rol guardado = rolRepository.save(rol);
        Set<Long> permisos = normalizarPermisos(request.getPermisos());
        actualizarPermisos(guardado.getId(), permisos);
        return toResponse(guardado, permisos);
    }

    @Override
    @Transactional
    public RolResponse actualizar(Long tiendaId, Long rolId, RolUpdateRequest request) {
        Rol rol = rolRepository.findByIdAndTiendaId(rolId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        if (!rol.getNombre().equalsIgnoreCase(request.getNombre()) &&
                rolRepository.existsByTiendaIdAndNombreAndIdNot(tiendaId, request.getNombre(), rolId)) {
            throw new BadRequestException("Ya existe un rol con ese nombre");
        }

        if (Boolean.TRUE.equals(rol.getEsSistema()) &&
                (request.getEsSistema() != null && !request.getEsSistema())) {
            throw new BadRequestException("No es posible cambiar la bandera de rol del sistema");
        }

        rol.setNombre(request.getNombre());
        rol.setDescripcion(request.getDescripcion());

        if (request.getEsSistema() != null) {
            rol.setEsSistema(request.getEsSistema());
        }

        Rol actualizado = rolRepository.save(rol);

        if (request.getPermisos() != null) {
            Set<Long> permisos = normalizarPermisos(request.getPermisos());
            actualizarPermisos(actualizado.getId(), permisos);
        }

        return toResponse(actualizado, new HashSet<>(rolPermisoRepository.findPermisoIdsByRolId(actualizado.getId())));
    }

    @Override
    @Transactional
    public void eliminar(Long tiendaId, Long rolId) {
        Rol rol = rolRepository.findByIdAndTiendaId(rolId, tiendaId)
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado"));

        if (Boolean.TRUE.equals(rol.getEsSistema())) {
            throw new BadRequestException("No se puede eliminar un rol del sistema");
        }

        if (usuarioTiendaRepository.existsByTiendaIdAndRolId(tiendaId, rolId)) {
            throw new BadRequestException("No se puede eliminar un rol asignado a usuarios activos");
        }

        rolPermisoRepository.deleteByRolId(rol.getId());
        rolRepository.delete(rol);
    }

    private Set<Long> normalizarPermisos(Set<Long> permisos) {
        if (permisos == null || permisos.isEmpty()) {
            return Set.of();
        }
        Set<Long> existentes = new HashSet<>(permisos);
        List<Permiso> encontrados = permisoRepository.findAllById(existentes);
        if (encontrados.size() != existentes.size()) {
            throw new BadRequestException("Uno o más permisos no existen");
        }
        return existentes;
    }

    private void actualizarPermisos(Long rolId, Set<Long> permisos) {
        rolPermisoRepository.deleteByRolId(rolId);
        permisos.forEach(permisoId -> rolPermisoRepository.insertarRelacion(rolId, permisoId));
    }

    private RolResponse toResponse(Rol rol, Set<Long> permisos) {
        return RolResponse.builder()
                .id(rol.getId())
                .tiendaId(rol.getTiendaId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .esSistema(rol.getEsSistema())
                .permisos(permisos)
                .build();
    }
}

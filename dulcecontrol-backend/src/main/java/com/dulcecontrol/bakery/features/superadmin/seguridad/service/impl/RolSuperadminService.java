package com.dulcecontrol.bakery.features.superadmin.seguridad.service.impl;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.PermisoSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.RolSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.PermisoSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.RolSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IRolSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RolSuperadminService implements IRolSuperadminService {

    private final RolSuperadminRepository rolRepository;
    private final PermisoSuperadminRepository permisoRepository;
    private final UsuarioSuperadminRepository usuarioRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RolSuperadminResponse> listar() {
        return rolRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre")).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RolSuperadminResponse obtener(Long id) {
        RolSuperadmin rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol superadmin no encontrado"));
        return toResponse(rol);
    }

    @Override
    @Transactional
    public RolSuperadminResponse crear(RolSuperadminCreateRequest request) {
        String nombreNormalizado = request.getNombre().trim();
        if (rolRepository.existsByNombreIgnoreCase(nombreNormalizado)) {
            throw new BadRequestException("Ya existe un rol con el mismo nombre");
        }

        Set<PermisoSuperadmin> permisos = resolverPermisos(request.getPermisos(), true);

        RolSuperadmin rol = new RolSuperadmin();
        rol.setNombre(nombreNormalizado);
        rol.setDescripcion(limpiar(request.getDescripcion()));
        rol.setPermisos(new HashSet<>(permisos));

        RolSuperadmin guardado = rolRepository.save(rol);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public RolSuperadminResponse actualizar(Long id, RolSuperadminUpdateRequest request) {
        RolSuperadmin rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol superadmin no encontrado"));

        String nombreNormalizado = request.getNombre().trim();
        boolean nombreCambio = !rol.getNombre().equalsIgnoreCase(nombreNormalizado);
        if (nombreCambio && rolRepository.existsByNombreIgnoreCaseAndIdNot(nombreNormalizado, id)) {
            throw new BadRequestException("Ya existe un rol con el mismo nombre");
        }

        rol.setNombre(nombreNormalizado);
        rol.setDescripcion(limpiar(request.getDescripcion()));

        if (request.getEsSistema() != null) {
            rol.setEsSistema(request.getEsSistema());
        }

        if (request.getPermisos() != null) {
            Set<PermisoSuperadmin> permisos = resolverPermisos(request.getPermisos(), true);
            rol.setPermisos(new HashSet<>(permisos));
        }

        RolSuperadmin actualizado = rolRepository.save(rol);
        return toResponse(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        RolSuperadmin rol = rolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rol superadmin no encontrado"));

        if (Boolean.TRUE.equals(rol.getEsSistema())) {
            throw new BadRequestException("No puedes eliminar un rol del sistema");
        }

        if (usuarioRepository.existsByRoles_Id(id)) {
            throw new BadRequestException("No puedes eliminar un rol asignado a superadministradores activos");
        }

        rolRepository.delete(rol);
    }

    private Set<PermisoSuperadmin> resolverPermisos(Set<String> permisosSlugs, boolean obligatorio) {
        if (permisosSlugs == null || permisosSlugs.isEmpty()) {
            if (obligatorio) {
                throw new BadRequestException("Debes seleccionar al menos un permiso");
            }
            return Set.of();
        }

        List<PermisoSuperadmin> encontrados = permisoRepository.findBySlugIn(permisosSlugs);
        if (encontrados.size() != permisosSlugs.size()) {
            throw new BadRequestException("Uno o más permisos no existen");
        }
        return new HashSet<>(encontrados);
    }

    private RolSuperadminResponse toResponse(RolSuperadmin rol) {
        Set<String> permisos = rol.getPermisos() == null ? Set.of() : rol.getPermisos().stream()
                .map(PermisoSuperadmin::getSlug)
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        long totalUsuarios = rol.getId() == null ? 0L : usuarioRepository.countByRoles_Id(rol.getId());

        return RolSuperadminResponse.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .esSistema(rol.getEsSistema())
                .permisos(permisos)
                .creadoEn(rol.getCreadoEn())
                .actualizadoEn(rol.getActualizadoEn())
                .totalUsuarios(totalUsuarios)
                .build();
    }

    private String limpiar(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}

package com.dulcecontrol.bakery.features.superadmin.seguridad.service.impl;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.PermisoSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.PermisoSuperadmin;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.PermisoSuperadminRepository;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IPermisoSuperadminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoSuperadminService implements IPermisoSuperadminService {

    private final PermisoSuperadminRepository permisoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PermisoSuperadminResponse> listar() {
        return permisoRepository.findAllByOrderByModuloAscNombreVisibleAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    private PermisoSuperadminResponse toResponse(PermisoSuperadmin permiso) {
        return PermisoSuperadminResponse.builder()
                .id(permiso.getId())
                .slug(permiso.getSlug())
                .nombreVisible(permiso.getNombreVisible())
                .modulo(permiso.getModulo())
                .build();
    }
}

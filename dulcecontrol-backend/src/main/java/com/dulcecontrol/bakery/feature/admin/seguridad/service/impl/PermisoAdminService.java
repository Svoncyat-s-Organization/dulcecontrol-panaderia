package com.dulcecontrol.bakery.feature.admin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.admin.seguridad.dto.PermisoResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.Permiso;
import com.dulcecontrol.bakery.feature.admin.seguridad.repository.PermisoRepository;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IPermisoAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PermisoAdminService implements IPermisoAdminService {

    private final PermisoRepository permisoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PermisoResponse> listarTodos() {
        return permisoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Permiso::getModulo).thenComparing(Permiso::getNombreVisible))
                .map(this::toResponse)
                .toList();
    }

    private PermisoResponse toResponse(Permiso permiso) {
        return PermisoResponse.builder()
                .id(permiso.getId())
                .slug(permiso.getSlug())
                .nombreVisible(permiso.getNombreVisible())
                .modulo(permiso.getModulo())
                .build();
    }
}

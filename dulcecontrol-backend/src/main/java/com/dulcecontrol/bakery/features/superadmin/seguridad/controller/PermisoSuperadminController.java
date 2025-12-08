package com.dulcecontrol.bakery.features.superadmin.seguridad.controller;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.PermisoSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IPermisoSuperadminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/seguridad/permisos")
@RequiredArgsConstructor
@Validated
public class PermisoSuperadminController {

    private final IPermisoSuperadminService permisoSuperadminService;

    @GetMapping
    public ResponseEntity<List<PermisoSuperadminResponse>> listar() {
        return ResponseEntity.ok(permisoSuperadminService.listar());
    }
}

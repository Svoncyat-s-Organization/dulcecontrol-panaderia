package com.dulcecontrol.bakery.features.admin.seguridad.controller;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.PermisoResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.service.IPermisoAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seguridad/permisos")
@RequiredArgsConstructor
public class PermisoAdminController {

    private final IPermisoAdminService permisoAdminService;

    @GetMapping
    public ResponseEntity<List<PermisoResponse>> listar() {
        return ResponseEntity.ok(permisoAdminService.listarTodos());
    }
}

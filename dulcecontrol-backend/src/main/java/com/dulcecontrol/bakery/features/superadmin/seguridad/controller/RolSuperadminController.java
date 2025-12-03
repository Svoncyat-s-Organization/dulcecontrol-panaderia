package com.dulcecontrol.bakery.features.superadmin.seguridad.controller;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IRolSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/seguridad/roles")
@RequiredArgsConstructor
@Validated
public class RolSuperadminController {

    private final IRolSuperadminService rolSuperadminService;

    @GetMapping
    public ResponseEntity<List<RolSuperadminResponse>> listar() {
        return ResponseEntity.ok(rolSuperadminService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolSuperadminResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(rolSuperadminService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<RolSuperadminResponse> crear(@Valid @RequestBody RolSuperadminCreateRequest request) {
        RolSuperadminResponse response = rolSuperadminService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolSuperadminResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody RolSuperadminUpdateRequest request) {
        return ResponseEntity.ok(rolSuperadminService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rolSuperadminService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

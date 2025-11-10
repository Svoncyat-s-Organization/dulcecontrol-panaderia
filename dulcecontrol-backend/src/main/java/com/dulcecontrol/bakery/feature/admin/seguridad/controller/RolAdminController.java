package com.dulcecontrol.bakery.feature.admin.seguridad.controller;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.RolCreateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.RolResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.RolUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IRolAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/seguridad/roles")
@RequiredArgsConstructor
@Validated
public class RolAdminController {

    private final IRolAdminService rolAdminService;

    @GetMapping
    public ResponseEntity<List<RolResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(rolAdminService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{rolId}")
    public ResponseEntity<RolResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long rolId) {
        return ResponseEntity.ok(rolAdminService.obtenerPorId(tiendaId, rolId));
    }

    @PostMapping
    public ResponseEntity<RolResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody RolCreateRequest request) {
        RolResponse response = rolAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{rolId}")
    public ResponseEntity<RolResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long rolId,
            @Valid @RequestBody RolUpdateRequest request) {
        RolResponse response = rolAdminService.actualizar(tiendaId, rolId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{rolId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long rolId) {
        rolAdminService.eliminar(tiendaId, rolId);
        return ResponseEntity.noContent().build();
    }
}

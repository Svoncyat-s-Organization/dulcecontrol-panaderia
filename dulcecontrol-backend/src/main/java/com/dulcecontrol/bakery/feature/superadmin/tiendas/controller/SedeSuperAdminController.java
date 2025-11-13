package com.dulcecontrol.bakery.feature.superadmin.tiendas.controller;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeResponse;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.service.ISedeSuperAdminService;
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
@RequestMapping("/api/superadmin/tiendas/{tiendaId}/sedes")
@RequiredArgsConstructor
@Validated
public class SedeSuperAdminController {

    private final ISedeSuperAdminService sedeService;

    @GetMapping
    public ResponseEntity<List<SedeResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(sedeService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{sedeId}")
    public ResponseEntity<SedeResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long sedeId) {
        return ResponseEntity.ok(sedeService.obtenerPorId(tiendaId, sedeId));
    }

    @PostMapping
    public ResponseEntity<SedeResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody SedeCreateRequest request) {
        SedeResponse response = sedeService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{sedeId}")
    public ResponseEntity<SedeResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @Valid @RequestBody SedeUpdateRequest request) {
        SedeResponse response = sedeService.actualizar(tiendaId, sedeId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{sedeId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long sedeId) {
        sedeService.eliminar(tiendaId, sedeId);
        return ResponseEntity.noContent().build();
    }
}

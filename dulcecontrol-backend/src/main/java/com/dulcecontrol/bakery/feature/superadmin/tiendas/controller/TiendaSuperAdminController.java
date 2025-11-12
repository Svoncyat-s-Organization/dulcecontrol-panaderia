package com.dulcecontrol.bakery.feature.superadmin.tiendas.controller;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.TiendaCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.TiendaResponse;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.TiendaUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.service.ITiendaSuperAdminService;
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
@RequestMapping("/api/superadmin/tiendas")
@RequiredArgsConstructor
@Validated
public class TiendaSuperAdminController {

    private final ITiendaSuperAdminService tiendaService;

    @GetMapping
    public ResponseEntity<List<TiendaResponse>> listar() {
        return ResponseEntity.ok(tiendaService.listar());
    }

    @GetMapping("/{tiendaId}")
    public ResponseEntity<TiendaResponse> obtener(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(tiendaService.obtenerPorId(tiendaId));
    }

    @PostMapping
    public ResponseEntity<TiendaResponse> crear(@Valid @RequestBody TiendaCreateRequest request) {
        TiendaResponse response = tiendaService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{tiendaId}")
    public ResponseEntity<TiendaResponse> actualizar(@PathVariable Long tiendaId,
            @Valid @RequestBody TiendaUpdateRequest request) {
        TiendaResponse response = tiendaService.actualizar(tiendaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{tiendaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId) {
        tiendaService.eliminar(tiendaId);
        return ResponseEntity.noContent().build();
    }
}

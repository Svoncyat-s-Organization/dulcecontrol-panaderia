package com.dulcecontrol.bakery.features.superadmin.tiendas.controller;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.service.IDominioSuperAdminService;
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
@RequestMapping("/api/superadmin/tiendas/{tiendaId}/dominios")
@RequiredArgsConstructor
@Validated
public class DominioSuperAdminController {

    private final IDominioSuperAdminService dominioService;

    @GetMapping
    public ResponseEntity<List<DominioResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(dominioService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{dominioId}")
    public ResponseEntity<DominioResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long dominioId) {
        return ResponseEntity.ok(dominioService.obtenerPorId(tiendaId, dominioId));
    }

    @PostMapping
    public ResponseEntity<DominioResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody DominioCreateRequest request) {
        DominioResponse response = dominioService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{dominioId}")
    public ResponseEntity<DominioResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long dominioId,
            @Valid @RequestBody DominioUpdateRequest request) {
        DominioResponse response = dominioService.actualizar(tiendaId, dominioId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{dominioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long dominioId) {
        dominioService.eliminar(tiendaId, dominioId);
        return ResponseEntity.noContent().build();
    }
}

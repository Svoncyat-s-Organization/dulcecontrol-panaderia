package com.dulcecontrol.bakery.feature.admin.compras.controller;

import com.dulcecontrol.bakery.feature.admin.compras.dto.ProveedorCreateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.dto.ProveedorResponse;
import com.dulcecontrol.bakery.feature.admin.compras.dto.ProveedorUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.service.IProveedorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/compras/proveedores")
@RequiredArgsConstructor
@Validated
public class ProveedorController {

    private final IProveedorService proveedorService;

    @GetMapping
    public ResponseEntity<List<ProveedorResponse>> listar(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) Boolean soloActivos) {

        if (Boolean.TRUE.equals(soloActivos)) {
            return ResponseEntity.ok(proveedorService.listarActivos(tiendaId));
        }

        return ResponseEntity.ok(proveedorService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{proveedorId}")
    public ResponseEntity<ProveedorResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long proveedorId) {
        return ResponseEntity.ok(proveedorService.obtenerPorId(tiendaId, proveedorId));
    }

    @PostMapping
    public ResponseEntity<ProveedorResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody ProveedorCreateRequest request) {
        request.setTiendaId(tiendaId);
        ProveedorResponse response = proveedorService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{proveedorId}")
    public ResponseEntity<ProveedorResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long proveedorId,
            @Valid @RequestBody ProveedorUpdateRequest request) {
        ProveedorResponse response = proveedorService.actualizar(tiendaId, proveedorId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{proveedorId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long proveedorId) {
        proveedorService.eliminar(tiendaId, proveedorId);
        return ResponseEntity.noContent().build();
    }
}

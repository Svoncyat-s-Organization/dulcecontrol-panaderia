package com.dulcecontrol.bakery.feature.admin.compras.controller;

import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.InsumoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.InsumoResponse;
import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.InsumoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.service.IInsumoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/compras/insumos")
@RequiredArgsConstructor
@Validated
public class InsumoController {

    private final IInsumoService insumoService;

    @GetMapping
    public ResponseEntity<List<InsumoResponse>> listar(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) Boolean soloActivos,
            @RequestParam(required = false) Boolean stockBajo) {

        if (Boolean.TRUE.equals(stockBajo)) {
            return ResponseEntity.ok(insumoService.listarConStockBajo(tiendaId));
        }

        if (Boolean.TRUE.equals(soloActivos)) {
            return ResponseEntity.ok(insumoService.listarActivos(tiendaId));
        }

        return ResponseEntity.ok(insumoService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{insumoId}")
    public ResponseEntity<InsumoResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long insumoId) {
        return ResponseEntity.ok(insumoService.obtenerPorId(tiendaId, insumoId));
    }

    @PostMapping
    public ResponseEntity<InsumoResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody InsumoCreateRequest request) {
        request.setTiendaId(tiendaId);
        InsumoResponse response = insumoService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{insumoId}")
    public ResponseEntity<InsumoResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long insumoId,
            @Valid @RequestBody InsumoUpdateRequest request) {
        InsumoResponse response = insumoService.actualizar(tiendaId, insumoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{insumoId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long insumoId) {
        insumoService.eliminar(tiendaId, insumoId);
        return ResponseEntity.noContent().build();
    }
}

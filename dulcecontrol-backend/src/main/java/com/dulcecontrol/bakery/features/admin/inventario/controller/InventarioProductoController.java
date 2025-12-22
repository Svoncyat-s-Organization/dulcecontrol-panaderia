package com.dulcecontrol.bakery.features.admin.inventario.controller;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.UbicacionFisicaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.service.IInventarioProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/productos")
@RequiredArgsConstructor
@Validated
public class InventarioProductoController {

    private final IInventarioProductoService service;

    @GetMapping
    public ResponseEntity<List<InventarioProductoResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<InventarioProductoResponse>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventarioProductoResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/bajo-stock")
    public ResponseEntity<List<InventarioProductoResponse>> listarBajoStock(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @RequestParam(defaultValue = "5") Integer cantidadMinima) {
        return ResponseEntity.ok(service.listarBajoStock(tiendaId, sedeId, cantidadMinima));
    }

    @PostMapping
    public ResponseEntity<InventarioProductoResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody InventarioProductoCreateRequest request) {
        InventarioProductoResponse creado = service.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventarioProductoResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody InventarioProductoUpdateRequest request) {
        InventarioProductoResponse actualizado = service.actualizar(tiendaId, id, request);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/ubicacion")
    public ResponseEntity<InventarioProductoResponse> actualizarUbicacion(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody UbicacionFisicaUpdateRequest request) {
        InventarioProductoResponse actualizado = service.actualizarUbicacion(tiendaId, id, request);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        service.eliminar(tiendaId, id);
        return ResponseEntity.noContent().build();
    }
}

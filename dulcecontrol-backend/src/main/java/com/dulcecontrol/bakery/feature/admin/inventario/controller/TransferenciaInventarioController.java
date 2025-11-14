package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.TransferenciaInventarioCreateRequest;
import com.dulcecontrol.bakery.feature.admin.inventario.dto.TransferenciaInventarioUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.inventario.dto.TransferenciaInventarioResponse;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.service.ITransferenciaInventarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/transferencias")
@RequiredArgsConstructor
@Validated
public class TransferenciaInventarioController {

    private final ITransferenciaInventarioService service;

    @GetMapping
    public ResponseEntity<List<TransferenciaInventarioResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TransferenciaInventarioResponse>> listarPorEstado(
            @PathVariable Long tiendaId,
            @PathVariable EstadoTransferencia estado) {
        return ResponseEntity.ok(service.listarPorEstado(tiendaId, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @PostMapping
    public ResponseEntity<TransferenciaInventarioResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody TransferenciaInventarioCreateRequest request) {
        TransferenciaInventarioResponse creado = service.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody TransferenciaInventarioUpdateRequest request) {
        TransferenciaInventarioResponse actualizado = service.actualizar(tiendaId, id, request);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TransferenciaInventarioResponse> cambiarEstado(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @RequestParam EstadoTransferencia nuevoEstado) {
        TransferenciaInventarioResponse actualizado = service.cambiarEstado(tiendaId, id, nuevoEstado);
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

package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.TransferenciaInventarioDTO;
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
    public ResponseEntity<List<TransferenciaInventarioDTO>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TransferenciaInventarioDTO>> listarPorEstado(
            @PathVariable Long tiendaId,
            @PathVariable EstadoTransferencia estado) {
        return ResponseEntity.ok(service.listarPorEstado(tiendaId, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioDTO> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @PostMapping
    public ResponseEntity<TransferenciaInventarioDTO> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody TransferenciaInventarioDTO dto) {
        TransferenciaInventarioDTO creado = service.crear(tiendaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioDTO> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @Valid @RequestBody TransferenciaInventarioDTO dto) {
        TransferenciaInventarioDTO actualizado = service.actualizar(tiendaId, id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TransferenciaInventarioDTO> cambiarEstado(
            @PathVariable Long tiendaId,
            @PathVariable Long id,
            @RequestParam EstadoTransferencia nuevoEstado) {
        TransferenciaInventarioDTO actualizado = service.cambiarEstado(tiendaId, id, nuevoEstado);
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

package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.TransferenciaInventarioDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import com.dulcecontrol.bakery.feature.admin.inventario.service.ITransferenciaInventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventario/transferencias")
@RequiredArgsConstructor
public class TransferenciaInventarioController {

    private final ITransferenciaInventarioService service;

    @GetMapping
    public ResponseEntity<List<TransferenciaInventarioDTO>> obtenerTodas() {
        return ResponseEntity.ok(service.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<TransferenciaInventarioDTO>> obtenerPorTienda(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.obtenerPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<TransferenciaInventarioDTO>> obtenerPorSede(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerPorSede(sedeId));
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TransferenciaInventarioDTO>> obtenerPorEstado(@PathVariable EstadoTransferencia estado) {
        return ResponseEntity.ok(service.obtenerPorEstado(estado));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<TransferenciaInventarioDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(service.obtenerPorRangoFechas(fechaInicio, fechaFin));
    }

    @PostMapping
    public ResponseEntity<TransferenciaInventarioDTO> crear(@RequestBody TransferenciaInventarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferenciaInventarioDTO> actualizar(
            @PathVariable Long id,
            @RequestBody TransferenciaInventarioDTO dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<TransferenciaInventarioDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestParam EstadoTransferencia nuevoEstado) {
        return ResponseEntity.ok(service.cambiarEstado(id, nuevoEstado));
    }

    @PatchMapping("/{id}/autorizar")
    public ResponseEntity<TransferenciaInventarioDTO> autorizarTransferencia(
            @PathVariable Long id,
            @RequestParam Long autorizadoPor) {
        return ResponseEntity.ok(service.autorizarTransferencia(id, autorizadoPor));
    }

    @PatchMapping("/{id}/recibir")
    public ResponseEntity<TransferenciaInventarioDTO> recibirTransferencia(
            @PathVariable Long id,
            @RequestParam Long recibidoPor) {
        return ResponseEntity.ok(service.recibirTransferencia(id, recibidoPor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

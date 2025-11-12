package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioInsumoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioInsumoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventario/movimientos/insumos")
@RequiredArgsConstructor
public class MovimientoInventarioInsumoController {

    private final IMovimientoInventarioInsumoService service;

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioInsumoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorTienda(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.obtenerPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorSede(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerPorSede(sedeId));
    }

    @GetMapping("/insumo/{insumoId}")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorInsumo(@PathVariable Long insumoId) {
        return ResponseEntity.ok(service.obtenerPorInsumo(insumoId));
    }

    @GetMapping("/sede/{sedeId}/insumo/{insumoId}")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorSedeEInsumo(
            @PathVariable Long sedeId,
            @PathVariable Long insumoId) {
        return ResponseEntity.ok(service.obtenerPorSedeEInsumo(sedeId, insumoId));
    }

    @GetMapping("/tienda/{tiendaId}/tipo/{tipoMovimiento}")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorTipoMovimiento(
            @PathVariable Long tiendaId,
            @PathVariable TipoMovimientoInsumo tipoMovimiento) {
        return ResponseEntity.ok(service.obtenerPorTipoMovimiento(tiendaId, tipoMovimiento));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioInsumoDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(service.obtenerPorRangoFechas(fechaInicio, fechaFin));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioInsumoDTO> crear(@RequestBody MovimientoInventarioInsumoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }
}

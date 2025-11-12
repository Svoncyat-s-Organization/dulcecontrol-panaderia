package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/inventario/movimientos/productos")
@RequiredArgsConstructor
public class MovimientoInventarioProductoController {

    private final IMovimientoInventarioProductoService service;

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerTodos() {
        return ResponseEntity.ok(service.obtenerTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(id));
    }

    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorTienda(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.obtenerPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorSede(@PathVariable Long sedeId) {
        return ResponseEntity.ok(service.obtenerPorSede(sedeId));
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(service.obtenerPorProducto(productoId));
    }

    @GetMapping("/sede/{sedeId}/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorSedeYProducto(
            @PathVariable Long sedeId,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(service.obtenerPorSedeYProducto(sedeId, productoId));
    }

    @GetMapping("/tienda/{tiendaId}/motivo/{motivo}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorMotivo(
            @PathVariable Long tiendaId,
            @PathVariable MotivoMovimientoProducto motivo) {
        return ResponseEntity.ok(service.obtenerPorMotivo(tiendaId, motivo));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return ResponseEntity.ok(service.obtenerPorRangoFechas(fechaInicio, fechaFin));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioProductoDTO> crear(@RequestBody MovimientoInventarioProductoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
    }
}

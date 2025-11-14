package com.dulcecontrol.bakery.feature.admin.inventario.controller;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.MovimientoInventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.service.IMovimientoInventarioProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/movimientos/productos")
@RequiredArgsConstructor
@Validated
public class MovimientoInventarioProductoController {

    private final IMovimientoInventarioProductoService service;

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/sede/{sedeId}/paginado")
    public ResponseEntity<Page<MovimientoInventarioProductoDTO>> listarPorSedePaginado(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            Pageable pageable) {
        return ResponseEntity.ok(service.listarPorTiendaYSedePaginado(tiendaId, sedeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioProductoDTO> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> listarPorProducto(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(service.listarPorProducto(tiendaId, sedeId, productoId));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioProductoDTO>> listarPorRangoFechas(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(service.listarPorRangoFechas(tiendaId, inicio, fin));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioProductoDTO> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody MovimientoInventarioProductoDTO dto) {
        MovimientoInventarioProductoDTO creado = service.crear(tiendaId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}

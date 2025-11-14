package com.dulcecontrol.bakery.features.admin.inventario.controller;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.service.IMovimientoInventarioProductoService;
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
    public ResponseEntity<List<MovimientoInventarioProductoResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<MovimientoInventarioProductoResponse>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/sede/{sedeId}/paginado")
    public ResponseEntity<Page<MovimientoInventarioProductoResponse>> listarPorSedePaginado(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            Pageable pageable) {
        return ResponseEntity.ok(service.listarPorTiendaYSedePaginado(tiendaId, sedeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioProductoResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/producto/{productoId}")
    public ResponseEntity<List<MovimientoInventarioProductoResponse>> listarPorProducto(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(service.listarPorProducto(tiendaId, sedeId, productoId));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioProductoResponse>> listarPorRangoFechas(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(service.listarPorRangoFechas(tiendaId, inicio, fin));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioProductoResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody MovimientoInventarioProductoCreateRequest request) {
        MovimientoInventarioProductoResponse creado = service.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}

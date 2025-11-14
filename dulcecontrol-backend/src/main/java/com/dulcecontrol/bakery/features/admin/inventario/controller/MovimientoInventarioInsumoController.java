package com.dulcecontrol.bakery.features.admin.inventario.controller;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.service.IMovimientoInventarioInsumoService;
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
@RequestMapping("/api/admin/tiendas/{tiendaId}/inventario/movimientos/insumos")
@RequiredArgsConstructor
@Validated
public class MovimientoInventarioInsumoController {

    private final IMovimientoInventarioInsumoService service;

    @GetMapping
    public ResponseEntity<List<MovimientoInventarioInsumoResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(service.listarPorTienda(tiendaId));
    }

    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<MovimientoInventarioInsumoResponse>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(service.listarPorTiendaYSede(tiendaId, sedeId));
    }

    @GetMapping("/sede/{sedeId}/paginado")
    public ResponseEntity<Page<MovimientoInventarioInsumoResponse>> listarPorSedePaginado(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            Pageable pageable) {
        return ResponseEntity.ok(service.listarPorTiendaYSedePaginado(tiendaId, sedeId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventarioInsumoResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long id) {
        return ResponseEntity.ok(service.obtenerPorId(tiendaId, id));
    }

    @GetMapping("/sede/{sedeId}/insumo/{insumoId}")
    public ResponseEntity<List<MovimientoInventarioInsumoResponse>> listarPorInsumo(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @PathVariable Long insumoId) {
        return ResponseEntity.ok(service.listarPorInsumo(tiendaId, sedeId, insumoId));
    }

    @GetMapping("/rango-fechas")
    public ResponseEntity<List<MovimientoInventarioInsumoResponse>> listarPorRangoFechas(
            @PathVariable Long tiendaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(service.listarPorRangoFechas(tiendaId, inicio, fin));
    }

    @PostMapping
    public ResponseEntity<MovimientoInventarioInsumoResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody MovimientoInventarioInsumoCreateRequest request) {
        MovimientoInventarioInsumoResponse creado = service.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}

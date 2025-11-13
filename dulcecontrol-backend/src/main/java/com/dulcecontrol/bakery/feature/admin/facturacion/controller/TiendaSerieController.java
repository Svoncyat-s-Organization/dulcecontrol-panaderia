package com.dulcecontrol.bakery.feature.admin.facturacion.controller;

import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaSerieRequest;
import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaSerieResponse;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.feature.admin.facturacion.service.TiendaSerieService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/facturacion/series")
@RequiredArgsConstructor
public class TiendaSerieController {

    private final TiendaSerieService tiendaSerieService;

    /**
     * [GET] Listar todas las series de una tienda
     */
    @GetMapping
    public ResponseEntity<List<TiendaSerieResponse>> listar(@PathVariable Long tiendaId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarPorTienda(tiendaId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Obtener una serie por ID
     */
    @GetMapping("/{serieId}")
    public ResponseEntity<TiendaSerieResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long serieId) {
        TiendaSerieResponse response = tiendaSerieService.obtenerPorIdYTienda(serieId, tiendaId);
        return ResponseEntity.ok(response);
    }

    /**
     * [POST] Crear una nueva serie de comprobantes
     */
    @PostMapping
    public ResponseEntity<TiendaSerieResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody TiendaSerieRequest request) {
        TiendaSerieResponse response = tiendaSerieService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [PUT] Actualizar una serie
     */
    @PutMapping("/{serieId}")
    public ResponseEntity<TiendaSerieResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long serieId,
            @Valid @RequestBody TiendaSerieRequest request) {
        TiendaSerieResponse response = tiendaSerieService.actualizar(tiendaId, serieId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * [DELETE] Desactivar una serie (soft delete)
     */
    @DeleteMapping("/{serieId}")
    public ResponseEntity<Void> desactivar(
            @PathVariable Long tiendaId,
            @PathVariable Long serieId) {
        tiendaSerieService.desactivar(tiendaId, serieId);
        return ResponseEntity.noContent().build();
    }

    /**
     * [GET] Listar series activas
     */
    @GetMapping("/activas")
    public ResponseEntity<List<TiendaSerieResponse>> listarActivas(@PathVariable Long tiendaId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarActivasPorTienda(tiendaId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar series por sede
     */
    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<TiendaSerieResponse>> listarPorSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarPorTiendaYSede(tiendaId, sedeId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar series por tipo de comprobante
     */
    @GetMapping("/tipo/{tipoComprobante}")
    public ResponseEntity<List<TiendaSerieResponse>> listarPorTipo(
            @PathVariable Long tiendaId,
            @PathVariable TipoComprobante tipoComprobante) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarActivasPorTiendaYTipo(tiendaId, tipoComprobante);
        return ResponseEntity.ok(response);
    }

    /**
     * [PUT] Activar una serie previamente desactivada
     */
    @PutMapping("/{serieId}/activar")
    public ResponseEntity<Void> activar(
            @PathVariable Long tiendaId,
            @PathVariable Long serieId) {
        tiendaSerieService.activar(tiendaId, serieId);
        return ResponseEntity.ok().build();
    }

    /**
     * [POST] Incrementar el correlativo de una serie
     */
    @PostMapping("/{serieId}/incrementar-correlativo")
    public ResponseEntity<Integer> incrementarCorrelativo(
            @PathVariable Long tiendaId,
            @PathVariable Long serieId) {
        Integer nuevoCorrelativo = tiendaSerieService.incrementarCorrelativo(tiendaId, serieId);
        return ResponseEntity.ok(nuevoCorrelativo);
    }
}

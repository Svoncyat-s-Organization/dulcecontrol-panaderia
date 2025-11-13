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
@RequestMapping("/api/admin/facturacion/series")
@RequiredArgsConstructor
public class TiendaSerieController {

    private final TiendaSerieService tiendaSerieService;

    /**
     * [POST] Crear una nueva serie de comprobantes
     */
    @PostMapping
    public ResponseEntity<TiendaSerieResponse> crear(@Valid @RequestBody TiendaSerieRequest request) {
        TiendaSerieResponse response = tiendaSerieService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [GET] Obtener una serie por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TiendaSerieResponse> obtenerPorId(@PathVariable Long id) {
        TiendaSerieResponse response = tiendaSerieService.obtenerPorId(id);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar todas las series de una tienda
     */
    @GetMapping("/tienda/{tiendaId}")
    public ResponseEntity<List<TiendaSerieResponse>> listarPorTienda(@PathVariable Long tiendaId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarPorTienda(tiendaId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar todas las series de una sede
     */
    @GetMapping("/sede/{sedeId}")
    public ResponseEntity<List<TiendaSerieResponse>> listarPorSede(@PathVariable Long sedeId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarPorSede(sedeId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar series activas de una tienda
     */
    @GetMapping("/tienda/{tiendaId}/activas")
    public ResponseEntity<List<TiendaSerieResponse>> listarActivasPorTienda(@PathVariable Long tiendaId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarActivasPorTienda(tiendaId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar series activas de una sede
     */
    @GetMapping("/sede/{sedeId}/activas")
    public ResponseEntity<List<TiendaSerieResponse>> listarActivasPorSede(@PathVariable Long sedeId) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarActivasPorSede(sedeId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Listar series activas de una tienda filtradas por tipo de comprobante
     */
    @GetMapping("/tienda/{tiendaId}/tipo/{tipoComprobante}/activas")
    public ResponseEntity<List<TiendaSerieResponse>> listarActivasPorTiendaYTipo(
            @PathVariable Long tiendaId,
            @PathVariable TipoComprobante tipoComprobante) {
        List<TiendaSerieResponse> response = tiendaSerieService.listarActivasPorTiendaYTipo(tiendaId, tipoComprobante);
        return ResponseEntity.ok(response);
    }

    /**
     * [PUT] Actualizar una serie
     */
    @PutMapping("/{id}")
    public ResponseEntity<TiendaSerieResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TiendaSerieRequest request) {
        TiendaSerieResponse response = tiendaSerieService.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * [DELETE] Desactivar una serie (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        tiendaSerieService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * [PUT] Activar una serie previamente desactivada
     */
    @PutMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        tiendaSerieService.activar(id);
        return ResponseEntity.ok().build();
    }

    /**
     * [POST] Incrementar el correlativo de una serie
     */
    @PostMapping("/{id}/incrementar-correlativo")
    public ResponseEntity<Integer> incrementarCorrelativo(@PathVariable Long id) {
        Integer nuevoCorrelativo = tiendaSerieService.incrementarCorrelativo(id);
        return ResponseEntity.ok(nuevoCorrelativo);
    }
}

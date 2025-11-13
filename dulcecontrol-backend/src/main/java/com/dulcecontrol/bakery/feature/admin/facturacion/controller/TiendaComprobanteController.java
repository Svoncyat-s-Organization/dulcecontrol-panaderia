package com.dulcecontrol.bakery.feature.admin.facturacion.controller;

import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteRequest;
import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteResponse;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.feature.admin.facturacion.service.TiendaComprobanteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/facturacion/comprobantes")
@RequiredArgsConstructor
public class TiendaComprobanteController {

    private final TiendaComprobanteService tiendaComprobanteService;

    /**
     * [GET] Listar todos los comprobantes de una tienda con filtros opcionales
     */
    @GetMapping
    public ResponseEntity<List<TiendaComprobanteResponse>> listar(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) EstadoSunat estado,
            @RequestParam(required = false) TipoComprobante tipo,
            @RequestParam(required = false) Long serieId,
            @RequestParam(required = false) String clienteNumeroDoc,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {

        // Filtro por serie
        if (serieId != null) {
            return ResponseEntity.ok(tiendaComprobanteService.listarPorSerie(serieId));
        }

        // Filtro por cliente
        if (clienteNumeroDoc != null) {
            return ResponseEntity.ok(tiendaComprobanteService.listarPorCliente(clienteNumeroDoc)
                    .stream()
                    .filter(comp -> comp.getTiendaId().equals(tiendaId))
                    .toList());
        }

        // Filtro por estado y tipo
        if (estado != null && tipo != null) {
            return ResponseEntity.ok(tiendaComprobanteService.listarPorTiendaYEstado(tiendaId, estado)
                    .stream()
                    .filter(comp -> comp.getTipoComprobante() == tipo)
                    .toList());
        }

        // Filtro por estado
        if (estado != null) {
            return ResponseEntity.ok(tiendaComprobanteService.listarPorTiendaYEstado(tiendaId, estado));
        }

        // Filtro por tipo
        if (tipo != null) {
            return ResponseEntity.ok(tiendaComprobanteService.listarPorTiendaYTipo(tiendaId, tipo));
        }

        // Filtro por rango de fechas
        if (fechaInicio != null && fechaFin != null) {
            return ResponseEntity
                    .ok(tiendaComprobanteService.listarPorTiendaYRangoFechas(tiendaId, fechaInicio, fechaFin));
        }

        // Sin filtros: listar todos de la tienda
        return ResponseEntity.ok(tiendaComprobanteService.listarPorTienda(tiendaId));
    }

    /**
     * [GET] Obtener un comprobante por ID
     */
    @GetMapping("/{comprobanteId}")
    public ResponseEntity<TiendaComprobanteResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long comprobanteId) {
        TiendaComprobanteResponse response = tiendaComprobanteService.obtenerPorId(comprobanteId);
        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Obtener comprobante por ID de pedido
     */
    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<TiendaComprobanteResponse> obtenerPorPedido(
            @PathVariable Long tiendaId,
            @PathVariable Long pedidoId) {
        TiendaComprobanteResponse response = tiendaComprobanteService.obtenerPorPedidoId(pedidoId);
        return ResponseEntity.ok(response);
    }

    /**
     * [POST] Crear un nuevo comprobante
     */
    @PostMapping
    public ResponseEntity<TiendaComprobanteResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody TiendaComprobanteRequest request) {
        TiendaComprobanteResponse response = tiendaComprobanteService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [PUT] Actualizar un comprobante
     */
    @PutMapping("/{comprobanteId}")
    public ResponseEntity<TiendaComprobanteResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long comprobanteId,
            @Valid @RequestBody TiendaComprobanteRequest request) {
        TiendaComprobanteResponse response = tiendaComprobanteService.actualizar(comprobanteId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * [PATCH] Actualizar estado SUNAT de un comprobante
     */
    @PatchMapping("/{comprobanteId}/estado-sunat")
    public ResponseEntity<TiendaComprobanteResponse> actualizarEstadoSunat(
            @PathVariable Long tiendaId,
            @PathVariable Long comprobanteId,
            @RequestBody Map<String, String> payload) {
        EstadoSunat nuevoEstado = EstadoSunat.fromValor(payload.get("estadoSunat"));
        String codigoRespuesta = payload.get("codigoRespuesta");
        String descripcionRespuesta = payload.get("descripcionRespuesta");

        TiendaComprobanteResponse response = tiendaComprobanteService.actualizarEstadoSunat(
                comprobanteId, nuevoEstado, codigoRespuesta, descripcionRespuesta);
        return ResponseEntity.ok(response);
    }

    /**
     * [POST] Registrar envío a SUNAT de un comprobante
     */
    @PostMapping("/{comprobanteId}/enviar-sunat")
    public ResponseEntity<TiendaComprobanteResponse> registrarEnvioSunat(
            @PathVariable Long tiendaId,
            @PathVariable Long comprobanteId,
            @RequestBody Map<String, String> payload) {
        String codigoHash = payload.get("codigoHash");
        String xmlUrl = payload.get("xmlUrl");
        String cdrUrl = payload.get("cdrUrl");
        String pdfUrl = payload.get("pdfUrl");

        TiendaComprobanteResponse response = tiendaComprobanteService.registrarEnvioSunat(
                comprobanteId, codigoHash, xmlUrl, cdrUrl, pdfUrl);
        return ResponseEntity.ok(response);
    }

    /**
     * [DELETE] Eliminar un comprobante (solo si está en estado PENDIENTE)
     */
    @DeleteMapping("/{comprobanteId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long comprobanteId) {
        tiendaComprobanteService.eliminar(comprobanteId);
        return ResponseEntity.noContent().build();
    }
}

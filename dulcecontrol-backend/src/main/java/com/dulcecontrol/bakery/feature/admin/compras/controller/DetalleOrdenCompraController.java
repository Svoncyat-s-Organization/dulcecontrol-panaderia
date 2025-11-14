package com.dulcecontrol.bakery.feature.admin.compras.controller;

import com.dulcecontrol.bakery.feature.admin.compras.dto.DetalleOrdenCompraRequest;
import com.dulcecontrol.bakery.feature.admin.compras.dto.DetalleOrdenCompraResponse;
import com.dulcecontrol.bakery.feature.admin.compras.service.IDetalleOrdenCompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/compras/ordenes/{ordenCompraId}/detalles")
@RequiredArgsConstructor
public class DetalleOrdenCompraController {

    private final IDetalleOrdenCompraService detalleOrdenCompraService;

    /**
     * [GET] Listar todos los detalles de una orden de compra
     */
    @GetMapping
    public ResponseEntity<List<DetalleOrdenCompraResponse>> listar(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @RequestParam(required = false) Boolean soloPendientes) {

        if (Boolean.TRUE.equals(soloPendientes)) {
            return ResponseEntity.ok(detalleOrdenCompraService.listarPendientesPorOrdenCompra(ordenCompraId));
        }

        return ResponseEntity.ok(detalleOrdenCompraService.listarPorOrdenCompra(ordenCompraId));
    }

    /**
     * [GET] Obtener un detalle por ID
     */
    @GetMapping("/{detalleId}")
    public ResponseEntity<DetalleOrdenCompraResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @PathVariable Long detalleId) {
        return ResponseEntity.ok(detalleOrdenCompraService.obtenerPorId(detalleId));
    }

    /**
     * [POST] Agregar un detalle a una orden de compra existente
     */
    @PostMapping
    public ResponseEntity<DetalleOrdenCompraResponse> crear(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @Valid @RequestBody DetalleOrdenCompraRequest request) {
        DetalleOrdenCompraResponse response = detalleOrdenCompraService.crear(ordenCompraId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [PUT] Actualizar un detalle de orden de compra
     */
    @PutMapping("/{detalleId}")
    public ResponseEntity<DetalleOrdenCompraResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @PathVariable Long detalleId,
            @Valid @RequestBody DetalleOrdenCompraRequest request) {
        DetalleOrdenCompraResponse response = detalleOrdenCompraService.actualizar(detalleId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * [PATCH] Actualizar recepción de un detalle (cantidad recibida y estado de
     * completitud)
     */
    @PatchMapping("/{detalleId}/recepcion")
    public ResponseEntity<DetalleOrdenCompraResponse> actualizarRecepcion(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @PathVariable Long detalleId,
            @RequestBody Map<String, Object> payload) {

        Double cantidadRecibida = payload.containsKey("cantidadRecibida")
                ? ((Number) payload.get("cantidadRecibida")).doubleValue()
                : null;

        Boolean recibidoCompleto = payload.containsKey("recibidoCompleto")
                ? (Boolean) payload.get("recibidoCompleto")
                : null;

        DetalleOrdenCompraResponse response = detalleOrdenCompraService.actualizarRecepcion(
                detalleId, cantidadRecibida, recibidoCompleto);
        return ResponseEntity.ok(response);
    }

    /**
     * [DELETE] Eliminar un detalle de orden de compra
     */
    @DeleteMapping("/{detalleId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId,
            @PathVariable Long detalleId) {
        detalleOrdenCompraService.eliminar(detalleId);
        return ResponseEntity.noContent().build();
    }
}

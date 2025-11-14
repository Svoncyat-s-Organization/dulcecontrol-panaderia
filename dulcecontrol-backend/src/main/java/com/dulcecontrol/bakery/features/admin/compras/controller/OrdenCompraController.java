package com.dulcecontrol.bakery.features.admin.compras.controller;

import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraCreateRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraResponse;
import com.dulcecontrol.bakery.features.admin.compras.dto.OrdenCompraUpdateRequest;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.service.IOrdenCompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/compras/ordenes")
@RequiredArgsConstructor
@Validated
public class OrdenCompraController {

    private final IOrdenCompraService ordenCompraService;

    @GetMapping
    public ResponseEntity<List<OrdenCompraResponse>> listar(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) EstadoOrdenCompra estado,
            @RequestParam(required = false) Long sedeId,
            @RequestParam(required = false) Long proveedorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        if (sedeId != null && estado != null) {
            return ResponseEntity.ok(ordenCompraService.listarPorSede(sedeId)
                    .stream()
                    .filter(orden -> orden.getEstado() == estado)
                    .toList());
        }

        if (sedeId != null) {
            return ResponseEntity.ok(ordenCompraService.listarPorSede(sedeId));
        }

        if (proveedorId != null) {
            return ResponseEntity.ok(ordenCompraService.listarPorProveedor(proveedorId));
        }

        if (estado != null) {
            return ResponseEntity.ok(ordenCompraService.listarPorTiendaYEstado(tiendaId, estado));
        }

        if (fechaInicio != null && fechaFin != null) {
            return ResponseEntity.ok(ordenCompraService.listarPorFechas(tiendaId, fechaInicio, fechaFin));
        }

        return ResponseEntity.ok(ordenCompraService.listarPorTienda(tiendaId));
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<OrdenCompraResponse>> listarPendientes(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) Long sedeId) {
        
        if (sedeId != null) {
            return ResponseEntity.ok(ordenCompraService.listarOrdenesPendientes(sedeId));
        }
        
        // Si no se proporciona sedeId, retornar todas las pendientes de la tienda
        return ResponseEntity.ok(ordenCompraService.listarPorTiendaYEstado(tiendaId, EstadoOrdenCompra.ENVIADA)
                .stream()
                .filter(orden -> orden.getEstado() == EstadoOrdenCompra.ENVIADA || 
                                orden.getEstado() == EstadoOrdenCompra.RECIBIDA_PARCIAL)
                .toList());
    }

    @GetMapping("/{ordenId}")
    public ResponseEntity<OrdenCompraResponse> obtener(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenId) {
        return ResponseEntity.ok(ordenCompraService.obtenerPorId(tiendaId, ordenId));
    }

    @PostMapping
    public ResponseEntity<OrdenCompraResponse> crear(
            @PathVariable Long tiendaId,
            @Valid @RequestBody OrdenCompraCreateRequest request) {
        request.setTiendaId(tiendaId);
        OrdenCompraResponse response = ordenCompraService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{ordenId}")
    public ResponseEntity<OrdenCompraResponse> actualizar(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenId,
            @Valid @RequestBody OrdenCompraUpdateRequest request) {
        OrdenCompraResponse response = ordenCompraService.actualizar(tiendaId, ordenId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{ordenId}/estado")
    public ResponseEntity<OrdenCompraResponse> cambiarEstado(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenId,
            @RequestParam EstadoOrdenCompra estado) {
        OrdenCompraResponse response = ordenCompraService.cambiarEstado(tiendaId, ordenId, estado);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{ordenId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenId) {
        ordenCompraService.eliminar(tiendaId, ordenId);
        return ResponseEntity.noContent().build();
    }
}

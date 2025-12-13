package com.dulcecontrol.bakery.features.admin.compras.controller;

import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraResponse;
import com.dulcecontrol.bakery.features.admin.compras.service.IPagoOrdenCompraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/compras/pagos")
@RequiredArgsConstructor
@Validated
public class PagoOrdenCompraController {

    private final IPagoOrdenCompraService pagoOrdenCompraService;

    @PostMapping
    public ResponseEntity<PagoOrdenCompraResponse> registrarPago(
            @PathVariable Long tiendaId,
            @Valid @RequestBody PagoOrdenCompraRequest request) {
        PagoOrdenCompraResponse response = pagoOrdenCompraService.registrarPago(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/orden/{ordenCompraId}")
    public ResponseEntity<List<PagoOrdenCompraResponse>> obtenerHistorialPagos(
            @PathVariable Long tiendaId,
            @PathVariable Long ordenCompraId) {
        List<PagoOrdenCompraResponse> historial = pagoOrdenCompraService.obtenerHistorialPagos(ordenCompraId);
        return ResponseEntity.ok(historial);
    }

    @GetMapping("/{pagoId}")
    public ResponseEntity<PagoOrdenCompraResponse> obtenerPagoPorId(
            @PathVariable Long tiendaId,
            @PathVariable Long pagoId) {
        PagoOrdenCompraResponse response = pagoOrdenCompraService.obtenerPagoPorId(pagoId);
        return ResponseEntity.ok(response);
    }
}

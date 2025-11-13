package com.dulcecontrol.bakery.feature.superadmin.facturacion.controller;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto.TransaccionPagoResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoTransaccion;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.service.ITransaccionPagoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/facturacion/transacciones")
@RequiredArgsConstructor
@Validated
public class TransaccionPagoController {

    private final ITransaccionPagoService transaccionPagoService;

    @GetMapping
    public ResponseEntity<List<TransaccionPagoResponse>> listar(
            @RequestParam(required = false) Long comprobanteId,
            @RequestParam(required = false) EstadoTransaccion estado) {
        return ResponseEntity.ok(transaccionPagoService.listar(comprobanteId, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransaccionPagoResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(transaccionPagoService.obtener(id));
    }
}
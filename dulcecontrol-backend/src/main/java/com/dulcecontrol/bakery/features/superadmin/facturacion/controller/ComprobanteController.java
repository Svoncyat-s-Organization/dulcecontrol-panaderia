package com.dulcecontrol.bakery.features.superadmin.facturacion.controller;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.ComprobanteResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.DetalleComprobanteResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.features.superadmin.facturacion.service.IComprobanteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/facturacion/comprobantes")
@RequiredArgsConstructor
@Validated
public class ComprobanteController {

    private final IComprobanteService comprobanteService;

    @GetMapping
    public ResponseEntity<List<ComprobanteResponse>> listar(
            @RequestParam(required = false) Long tiendaId,
            @RequestParam(required = false) EstadoSunat estadoSunat,
            @RequestParam(required = false) TipoComprobante tipo) {
        return ResponseEntity.ok(comprobanteService.listar(tiendaId, estadoSunat, tipo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComprobanteResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(comprobanteService.obtener(id));
    }

    @GetMapping("/{comprobanteId}/detalles")
    public ResponseEntity<List<DetalleComprobanteResponse>> listarDetalles(@PathVariable Long comprobanteId) {
        return ResponseEntity.ok(comprobanteService.listarDetalles(comprobanteId));
    }
}
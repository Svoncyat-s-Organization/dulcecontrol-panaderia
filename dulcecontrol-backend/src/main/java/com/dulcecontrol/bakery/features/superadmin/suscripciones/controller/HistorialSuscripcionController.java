package com.dulcecontrol.bakery.features.superadmin.suscripciones.controller;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.HistorialSuscripcionResponse;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.service.IHistorialSuscripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/suscripciones/{suscripcionId}/historial")
@RequiredArgsConstructor
@Validated
public class HistorialSuscripcionController {

    private final IHistorialSuscripcionService historialService;

    @GetMapping
    public ResponseEntity<List<HistorialSuscripcionResponse>> listar(@PathVariable Long suscripcionId,
            @RequestParam(name = "limit", required = false) Integer limit) {
        List<HistorialSuscripcionResponse> historial = historialService.listarPorSuscripcion(suscripcionId);
        if (limit != null && limit > 0 && historial.size() > limit) {
            historial = historial.subList(0, limit);
        }
        return ResponseEntity.ok(historial);
    }
}

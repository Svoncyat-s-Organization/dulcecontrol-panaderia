package com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.ISuscripcionSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/suscripciones")
@RequiredArgsConstructor
@Validated
public class SuscripcionSuperadminController {

    private final ISuscripcionSuperadminService suscripcionService;

    @GetMapping
    public ResponseEntity<List<SuscripcionResponse>> listar(
            @RequestParam(name = "tiendaId", required = false) Long tiendaId,
            @RequestParam(name = "estado", required = false) EstadoSuscripcion estado) {
        return ResponseEntity.ok(suscripcionService.listar(tiendaId, estado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuscripcionResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(suscripcionService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<SuscripcionResponse> crear(@Valid @RequestBody SuscripcionCreateRequest request) {
        SuscripcionResponse response = suscripcionService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuscripcionResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody SuscripcionUpdateRequest request) {
        return ResponseEntity.ok(suscripcionService.actualizar(id, request));
    }
}

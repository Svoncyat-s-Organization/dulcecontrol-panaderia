package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.SesionCajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.SesionCajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.SesionCajaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.service.ISesionCajaAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/sesiones-caja")
@RequiredArgsConstructor
@Validated
public class SesionCajaAdminController {

    private final ISesionCajaAdminService sesionCajaAdminService;

    @GetMapping
    public ResponseEntity<List<SesionCajaResponse>> listar(@PathVariable Long tiendaId,
                                                           @RequestParam(value = "cajaId", required = false) Long cajaId,
                                                           @RequestParam(value = "estaAbierta", required = false) Boolean estaAbierta) {
        return ResponseEntity.ok(sesionCajaAdminService.listar(tiendaId, cajaId, estaAbierta));
    }

    @GetMapping("/{sesionId}")
    public ResponseEntity<SesionCajaResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long sesionId) {
        return ResponseEntity.ok(sesionCajaAdminService.obtener(tiendaId, sesionId));
    }

    @PostMapping
    public ResponseEntity<SesionCajaResponse> crear(@PathVariable Long tiendaId,
                                                    @Valid @RequestBody SesionCajaCreateRequest request) {
        SesionCajaResponse response = sesionCajaAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{sesionId}")
    public ResponseEntity<SesionCajaResponse> actualizar(@PathVariable Long tiendaId,
                                                         @PathVariable Long sesionId,
                                                         @Valid @RequestBody SesionCajaUpdateRequest request) {
        SesionCajaResponse response = sesionCajaAdminService.actualizar(tiendaId, sesionId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{sesionId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long sesionId) {
        sesionCajaAdminService.eliminar(tiendaId, sesionId);
        return ResponseEntity.noContent().build();
    }
}

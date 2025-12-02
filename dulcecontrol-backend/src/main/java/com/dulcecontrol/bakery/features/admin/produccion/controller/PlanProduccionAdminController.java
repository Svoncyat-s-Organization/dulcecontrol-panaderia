package com.dulcecontrol.bakery.features.admin.produccion.controller;

import com.dulcecontrol.bakery.features.admin.produccion.dto.DetallePlanProduccionResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.DetallePlanProduccionUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.PlanProduccionUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.service.PlanProduccionAdminService;
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
@RequestMapping("/api/admin/tiendas/{tiendaId}/produccion/planes-produccion")
@RequiredArgsConstructor
@Validated
public class PlanProduccionAdminController {

    private final PlanProduccionAdminService planService;

    @PostMapping
    public ResponseEntity<PlanProduccionResponse> crearPlan(
            @PathVariable Long tiendaId,
            @Valid @RequestBody PlanProduccionCreateRequest request) {
        PlanProduccionResponse response = planService.createPlan(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PlanProduccionResponse>> listarPlanes(
            @PathVariable Long tiendaId,
            @RequestParam(required = false) Long sedeId) {
        List<PlanProduccionResponse> planes = planService.listPlanesByTienda(tiendaId, sedeId);
        return ResponseEntity.ok(planes);
    }

    @GetMapping("/{fecha}/detalles")
    public ResponseEntity<PlanProduccionResponse> obtenerPlanChecklist(
            @PathVariable Long tiendaId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Long sedeId) {
        PlanProduccionResponse response = planService.getPlanBySedeAndFecha(tiendaId, sedeId, fecha);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{planId}")
    public ResponseEntity<PlanProduccionResponse> actualizarPlan(
            @PathVariable Long tiendaId,
            @PathVariable Long planId,
            @Valid @RequestBody PlanProduccionUpdateRequest request) {
        PlanProduccionResponse response = planService.updatePlan(tiendaId, planId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/detalles/{detalleId}")
    public ResponseEntity<DetallePlanProduccionResponse> actualizarDetalle(
            @PathVariable Long tiendaId,
            @PathVariable Long detalleId,
            @Valid @RequestBody DetallePlanProduccionUpdateRequest request) {
        DetallePlanProduccionResponse response = planService.updateDetalle(tiendaId, detalleId, request);
        return ResponseEntity.ok(response);
    }
}

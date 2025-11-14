package com.dulcecontrol.bakery.features.superadmin.suscripciones.controller;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanResponse;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.service.IPlanSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/suscripciones/planes")
@RequiredArgsConstructor
@Validated
public class PlanSuperadminController {

    private final IPlanSuperadminService planService;

    @GetMapping
    public ResponseEntity<List<PlanResponse>> listar(
            @RequestParam(name = "soloActivos", required = false) Boolean soloActivos) {
        return ResponseEntity.ok(planService.listar(soloActivos));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(planService.obtener(id));
    }

    @PostMapping
    public ResponseEntity<PlanResponse> crear(@Valid @RequestBody PlanCreateRequest request) {
        PlanResponse response = planService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody PlanUpdateRequest request) {
        return ResponseEntity.ok(planService.actualizar(id, request));
    }
}

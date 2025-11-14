package com.dulcecontrol.bakery.features.superadmin.seguridad.controller;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.ActividadSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.ActividadSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IActividadSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/seguridad/actividades")
@RequiredArgsConstructor
@Validated
public class ActividadSuperadminController {

    private final IActividadSuperadminService actividadSuperadminService;

    @GetMapping
    public ResponseEntity<List<ActividadSuperadminResponse>> listarRecientes(
            @RequestParam(name = "limit", defaultValue = "50") int limit) {
        return ResponseEntity.ok(actividadSuperadminService.listarRecientes(limit));
    }

    @GetMapping("/usuarios/{superadminId}")
    public ResponseEntity<List<ActividadSuperadminResponse>> listarPorSuperadmin(
            @PathVariable Long superadminId,
            @RequestParam(name = "limit", defaultValue = "50") int limit) {
        return ResponseEntity.ok(actividadSuperadminService.listarPorSuperadmin(superadminId, limit));
    }

    @PostMapping("/usuarios/{superadminId}")
    public ResponseEntity<ActividadSuperadminResponse> registrar(
            @PathVariable Long superadminId,
            @Valid @RequestBody ActividadSuperadminCreateRequest request) {
        ActividadSuperadminResponse response = actividadSuperadminService.registrar(superadminId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}

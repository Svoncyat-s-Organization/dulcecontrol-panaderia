package com.dulcecontrol.bakery.features.admin.produccion.controller;

import com.dulcecontrol.bakery.features.admin.produccion.dto.ConteoDiarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.ConteoDiarioResponse;
import com.dulcecontrol.bakery.features.admin.produccion.service.ConteoDiarioAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/produccion/conteos-diarios")
@RequiredArgsConstructor
@Validated
public class ConteoDiarioAdminController {

    private final ConteoDiarioAdminService conteoService;

    @PostMapping
    public ResponseEntity<ConteoDiarioResponse> crearConteo(
            @PathVariable Long tiendaId,
            @Valid @RequestBody ConteoDiarioCreateRequest request) {
        ConteoDiarioResponse response = conteoService.createConteo(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ConteoDiarioResponse>> listarConteos(
            @PathVariable Long tiendaId,
            @RequestParam Long sedeId) {
        List<ConteoDiarioResponse> conteos = conteoService.listConteosBySedeId(tiendaId, sedeId);
        return ResponseEntity.ok(conteos);
    }

    @GetMapping("/{fecha}")
    public ResponseEntity<ConteoDiarioResponse> obtenerConteo(
            @PathVariable Long tiendaId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Long sedeId) {
        Optional<ConteoDiarioResponse> conteo = conteoService.getConteoBySedeAndFecha(tiendaId, sedeId, fecha);
        return conteo
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

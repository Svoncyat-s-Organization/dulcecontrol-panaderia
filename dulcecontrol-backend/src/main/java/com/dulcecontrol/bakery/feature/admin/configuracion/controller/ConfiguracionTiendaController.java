package com.dulcecontrol.bakery.feature.admin.configuracion.controller;

import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.ConfiguracionTiendaResponse;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.ConfiguracionTiendaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.configuracion.service.IConfiguracionTiendaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion")
@RequiredArgsConstructor
@Validated
public class ConfiguracionTiendaController {

    private final IConfiguracionTiendaService configuracionTiendaService;

    @GetMapping
    public ResponseEntity<ConfiguracionTiendaResponse> obtener(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(configuracionTiendaService.obtenerPorTiendaId(tiendaId));
    }

    @PutMapping
    public ResponseEntity<ConfiguracionTiendaResponse> actualizar(@PathVariable Long tiendaId,
            @Valid @RequestBody ConfiguracionTiendaUpdateRequest request) {
        ConfiguracionTiendaResponse response = configuracionTiendaService.actualizar(tiendaId, request);
        return ResponseEntity.ok(response);
    }
}
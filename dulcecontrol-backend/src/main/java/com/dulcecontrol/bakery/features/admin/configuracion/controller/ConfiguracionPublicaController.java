package com.dulcecontrol.bakery.features.admin.configuracion.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionPublicaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestionar la configuración pública de la tienda
 * (banner, mensaje, horarios, redes sociales, políticas)
 */
@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion/publica")
@RequiredArgsConstructor
@Validated
public class ConfiguracionPublicaController {

    private final IConfiguracionPublicaService configuracionPublicaService;

    @GetMapping
    public ResponseEntity<ConfiguracionPublicaResponse> obtener(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(configuracionPublicaService.obtenerConfiguracionPublica(tiendaId));
    }

    @PutMapping
    public ResponseEntity<ConfiguracionPublicaResponse> actualizar(
            @PathVariable Long tiendaId,
            @Valid @RequestBody ConfiguracionPublicaUpdateRequest request) {
        return ResponseEntity.ok(configuracionPublicaService.actualizarConfiguracionPublica(tiendaId, request));
    }
}

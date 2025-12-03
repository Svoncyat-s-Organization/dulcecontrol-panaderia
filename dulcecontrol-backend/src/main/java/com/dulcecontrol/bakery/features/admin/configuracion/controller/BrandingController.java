package com.dulcecontrol.bakery.features.admin.configuracion.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IBrandingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para gestionar el branding de la tienda (logo, favicon, colores)
 */
@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion/branding")
@RequiredArgsConstructor
@Validated
public class BrandingController {

    private final IBrandingService brandingService;

    @GetMapping
    public ResponseEntity<BrandingResponse> obtener(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(brandingService.obtenerBrandingPorTienda(tiendaId));
    }

    @PutMapping
    public ResponseEntity<BrandingResponse> actualizar(
            @PathVariable Long tiendaId,
            @Valid @RequestBody BrandingUpdateRequest request) {
        return ResponseEntity.ok(brandingService.actualizarBranding(tiendaId, request));
    }
}

package com.dulcecontrol.bakery.features.publico.tienda.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionPublicaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.PaginaStorefrontResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IConfiguracionPublicaService;
import com.dulcecontrol.bakery.features.admin.configuracion.service.IPaginaStorefrontService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador público para que el Storefront consuma configuración y contenido
 * No requiere autenticación - datos públicos
 */
@RestController
@RequestMapping("/api/public/tienda/{tiendaId}")
@RequiredArgsConstructor
public class TiendaPublicaController {

    private final IConfiguracionPublicaService configuracionPublicaService;
    private final IPaginaStorefrontService paginaStorefrontService;

    /**
     * Obtiene la configuración completa de la tienda (branding + config pública)
     * Para usar en useEffect al iniciar el Storefront
     */
    @GetMapping("/config")
    public ResponseEntity<ConfiguracionPublicaResponse> obtenerConfiguracion(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(configuracionPublicaService.obtenerConfiguracionPublica(tiendaId));
    }

    /**
     * Lista todas las páginas activas y visibles en el menú
     * Para generar el menú dinámicamente
     */
    @GetMapping("/paginas")
    public ResponseEntity<List<PaginaStorefrontResponse>> listarPaginasActivas(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(paginaStorefrontService.listarPorTienda(tiendaId));
    }

    /**
     * Obtiene una página específica por su slug
     * Para renderizar AboutPage, ContactPage, etc.
     */
    @GetMapping("/paginas/{slug}")
    public ResponseEntity<PaginaStorefrontResponse> obtenerPaginaPorSlug(
            @PathVariable Long tiendaId,
            @PathVariable String slug) {
        return ResponseEntity.ok(paginaStorefrontService.obtenerPorSlug(tiendaId, slug));
    }
}

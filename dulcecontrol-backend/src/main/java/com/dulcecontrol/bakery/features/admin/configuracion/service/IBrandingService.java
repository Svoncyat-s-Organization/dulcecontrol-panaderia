package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.BrandingUpdateRequest;

/**
 * Servicio para gestionar el branding de la tienda (dominios_tienda)
 */
public interface IBrandingService {

    /**
     * Obtiene la configuración de branding (logo, colores) para la tienda
     */
    BrandingResponse obtenerBrandingPorTienda(Long tiendaId);

    /**
     * Actualiza el branding de la tienda (logo, favicon, colores)
     */
    BrandingResponse actualizarBranding(Long tiendaId, BrandingUpdateRequest request);
}

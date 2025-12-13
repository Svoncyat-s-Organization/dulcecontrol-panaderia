package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * DTO de respuesta para configuración pública de la tienda
 * Utilizado tanto en Admin (edición) como en Storefront (consumo)
 */
@Getter
@Builder
public class ConfiguracionPublicaResponse {

    private final Long tiendaId;
    private final String nombreTienda;
    private final String sloganParte1;
    private final String sloganParte2;
    private final String bannerPrincipalUrl;
    private final String mensajeBienvenida;
    private final String horarioAtencion; // JSON string
    private final String redesSociales; // JSON string
    
    // Desde dominios_tienda
    private final String urlLogo;
    private final String urlFavicon;
    private final String colorPrimario;
    private final String colorSecundario;
}

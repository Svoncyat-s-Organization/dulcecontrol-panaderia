package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * DTO de respuesta para información de branding (dominios_tienda)
 * Utilizado en el módulo de Configuración > Tienda Virtual > Apariencia
 */
@Getter
@Builder
public class BrandingResponse {

    private final Long id;
    private final Long tiendaId;
    private final String tipo; // TIENDA_VIRTUAL
    private final String urlDominio;
    private final String urlLogo;
    private final String urlFavicon;
    private final String colorPrimario; // Hex #RRGGBB
    private final String colorSecundario; // Hex #RRGGBB
    private final LocalDateTime actualizadoEn;
}

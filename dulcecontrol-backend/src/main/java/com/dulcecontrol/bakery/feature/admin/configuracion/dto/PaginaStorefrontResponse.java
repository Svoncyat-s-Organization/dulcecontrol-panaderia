package com.dulcecontrol.bakery.feature.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PaginaStorefrontResponse {

    private final Long id;
    private final Long tiendaId;
    private final String slug;
    private final String titulo;
    private final String contenido;
    private final String metaDescripcion;
    private final Integer ordenMenu;
    private final Boolean visibleEnMenu;
    private final Boolean activa;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}
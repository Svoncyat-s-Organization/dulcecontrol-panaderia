package com.dulcecontrol.bakery.features.superadmin.tiendas.dto;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDominioTienda;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DominioResponse {

    private final Long id;
    private final Long tiendaId;
    private final TipoDominioTienda tipo;
    private final String urlDominio;
    private final String urlLogo;
    private final String urlFavicon;
    private final String colorPrimario;
    private final String colorSecundario;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

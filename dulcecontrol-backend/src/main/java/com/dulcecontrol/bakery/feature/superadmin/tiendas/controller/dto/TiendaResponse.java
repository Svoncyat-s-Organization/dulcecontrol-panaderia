package com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.entity.enums.EstadoTienda;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.entity.enums.TipoDocumentoTienda;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TiendaResponse {

    private final Long id;
    private final String slug;
    private final TipoDocumentoTienda tipoDoc;
    private final String numeroDoc;
    private final String nombreDoc;
    private final String nombreComercial;
    private final String correoContacto;
    private final String telefonoContacto;
    private final EstadoTienda estado;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

package com.dulcecontrol.bakery.feature.admin.compras.controller.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.TipoDocumentoProveedor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ProveedorResponse {

    private final Long id;
    private final Long tiendaId;
    private final String nombreComercial;
    private final TipoDocumentoProveedor tipoDoc;
    private final String numeroDoc;
    private final String razonSocial;
    private final String nombreContacto;
    private final String telefonoContacto;
    private final String emailContacto;
    private final Boolean esGenerico;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
}

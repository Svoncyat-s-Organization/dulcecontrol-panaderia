package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoDireccionPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoDocumentoContacto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DireccionPedidoResponse {

    private final Long id;
    private final Long pedidoId;
    private final TipoDireccionPedido tipoDireccion;
    private final String nombreContacto;
    private final TipoDocumentoContacto tipoDocContacto;
    private final String numeroDocContacto;
    private final String telefonoContacto;
    private final String emailContacto;
    private final String direccionCompleta;
    private final String referencia;
    private final String distrito;
    private final String provincia;
    private final String departamento;
    private final String codigoUbigeo;
    private final String codigoPostal;
    private final LocalDateTime creadoEn;
}

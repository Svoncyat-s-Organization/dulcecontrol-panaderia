package com.dulcecontrol.bakery.feature.admin.clientes.controller.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DireccionClienteResponse {

    private final Long id;
    private final Long clienteId;
    private final String etiqueta;
    private final String direccionCompleta;
    private final String referencia;
    private final Long distritoId;
    private final String codigoPostal;
    private final Boolean esFiscal;
    private final Boolean esEntrega;
    private final LocalDateTime creadoEn;
}
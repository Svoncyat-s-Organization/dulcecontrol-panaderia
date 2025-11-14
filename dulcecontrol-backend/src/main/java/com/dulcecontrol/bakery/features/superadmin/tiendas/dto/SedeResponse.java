package com.dulcecontrol.bakery.features.superadmin.tiendas.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SedeResponse {

    private final Long id;
    private final Long tiendaId;
    private final String codigoInterno;
    private final String nombre;
    private final String direccion;
    private final String telefono;
    private final Long distritoId;
    private final Boolean esPrincipal;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

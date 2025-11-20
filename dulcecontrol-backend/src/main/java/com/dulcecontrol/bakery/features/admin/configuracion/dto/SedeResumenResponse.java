package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SedeResumenResponse {

    private final Long id;
    private final Long tiendaId;
    private final String nombre;
    private final String direccion;
    private final String telefono;
    private final Boolean esPrincipal;
}

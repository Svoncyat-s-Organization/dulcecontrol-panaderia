package com.dulcecontrol.bakery.feature.admin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.Set;

@Getter
@Builder
public class RolResponse {

    private final Long id;
    private final Long tiendaId;
    private final String nombre;
    private final String descripcion;
    private final Boolean esSistema;
    private final Set<Long> permisos;
}

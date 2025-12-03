package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Builder
public class RolSuperadminResponse {

    private final Long id;
    private final String nombre;
    private final String descripcion;
    private final Boolean esSistema;
    private final Set<String> permisos;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
    private final Long totalUsuarios;
}

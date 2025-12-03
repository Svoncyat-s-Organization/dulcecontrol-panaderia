package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RolSuperadminSummaryResponse {

    private final Long id;
    private final String nombre;
    private final Boolean esSistema;
}

package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PermisoSuperadminResponse {

    private final Long id;
    private final String slug;
    private final String nombreVisible;
    private final String modulo;
}

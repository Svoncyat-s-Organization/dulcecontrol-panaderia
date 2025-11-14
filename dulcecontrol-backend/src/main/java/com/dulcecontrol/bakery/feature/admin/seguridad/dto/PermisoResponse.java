package com.dulcecontrol.bakery.feature.admin.seguridad.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PermisoResponse {

    private final Long id;
    private final String slug;
    private final String nombreVisible;
    private final String modulo;
}

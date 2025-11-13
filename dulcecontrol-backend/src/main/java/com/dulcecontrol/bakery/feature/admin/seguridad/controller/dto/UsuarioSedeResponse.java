package com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsuarioSedeResponse {

    private final Long usuarioId;
    private final Long sedeId;
    private final String sedeNombre;
    private final Boolean esSedePrincipal;
}

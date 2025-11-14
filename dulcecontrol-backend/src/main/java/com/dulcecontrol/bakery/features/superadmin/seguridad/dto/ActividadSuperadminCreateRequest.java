package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActividadSuperadminCreateRequest {

    @NotBlank
    @Size(max = 100)
    private String tipoEvento;

    @Size(max = 45)
    private String ipOrigen;

    private JsonNode detalles;
}

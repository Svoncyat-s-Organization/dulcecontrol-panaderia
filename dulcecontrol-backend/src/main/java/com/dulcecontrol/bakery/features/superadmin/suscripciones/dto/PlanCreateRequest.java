package com.dulcecontrol.bakery.features.superadmin.suscripciones.dto;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlanCreateRequest {

    @NotBlank
    @Size(max = 50)
    private String codigo;

    @NotBlank
    @Size(max = 100)
    private String nombre;

    private String descripcion;

    @NotNull
    @Positive
    private Long precioMensualCentimos;

    @NotNull
    @Positive
    private Long precioAnualCentimos;

    @NotBlank
    @Size(min = 3, max = 3)
    private String moneda;

    @NotNull
    private JsonNode limites;

    private Boolean activo;
}

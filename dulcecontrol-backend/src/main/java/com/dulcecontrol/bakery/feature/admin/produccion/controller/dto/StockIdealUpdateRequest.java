package com.dulcecontrol.bakery.feature.admin.produccion.controller.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StockIdealUpdateRequest {

    @NotNull
    private Long sedeId;

    @NotNull
    private Long productoId;

    @NotNull
    @Min(0)
    private Integer cantidadIdeal;

    @Min(0)
    private Integer puntoReposicion;
}

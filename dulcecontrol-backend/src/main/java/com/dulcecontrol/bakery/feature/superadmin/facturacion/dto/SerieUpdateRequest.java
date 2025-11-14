package com.dulcecontrol.bakery.feature.superadmin.facturacion.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;

@Getter
public class SerieUpdateRequest {
    @Min(0)
    private Integer ultimoCorrelativo;
    private Boolean activo;
    private Boolean esPredeterminada;
}
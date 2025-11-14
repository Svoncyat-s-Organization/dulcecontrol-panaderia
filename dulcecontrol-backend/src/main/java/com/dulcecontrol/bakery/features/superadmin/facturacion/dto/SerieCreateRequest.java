package com.dulcecontrol.bakery.features.superadmin.facturacion.dto;

import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.TipoComprobante;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class SerieCreateRequest {
    @NotNull
    private TipoComprobante tiposComprobante;

    @NotBlank
    @Size(min = 1, max = 4)
    private String serie;

    private Boolean esPredeterminada = Boolean.FALSE;
}
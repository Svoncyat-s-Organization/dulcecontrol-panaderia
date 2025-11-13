package com.dulcecontrol.bakery.feature.admin.compras.controller.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.UnidadMedida;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class InsumoUpdateRequest {

    @NotBlank
    private String nombre;

    private String codigoInterno;

    @NotNull
    private UnidadMedida unidadBase;

    @NotNull
    private UnidadMedida unidadCompraHabitual;

    @DecimalMin("0.0001")
    private BigDecimal factorConversion;

    private Long costoPromedioUnitarioCentimos;

    private Long ultimoPrecioCompraCentimos;

    @DecimalMin("0")
    private BigDecimal stockActualGlobal;

    @DecimalMin("0")
    private BigDecimal stockMinimoGlobal;

    private Boolean activo;
}

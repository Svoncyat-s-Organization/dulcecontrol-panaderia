package com.dulcecontrol.bakery.feature.admin.compras.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.UnidadMedida;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class InsumoCreateRequest {

    @NotNull
    private Long tiendaId;

    @NotBlank
    private String nombre;

    private String codigoInterno;

    @NotNull
    private UnidadMedida unidadBase;

    @NotNull
    private UnidadMedida unidadCompraHabitual;

    @DecimalMin("0.0001")
    private BigDecimal factorConversion = BigDecimal.ONE;

    private Long costoPromedioUnitarioCentimos = 0L;

    private Long ultimoPrecioCompraCentimos;

    @DecimalMin("0")
    private BigDecimal stockActualGlobal = BigDecimal.ZERO;

    @DecimalMin("0")
    private BigDecimal stockMinimoGlobal = BigDecimal.ZERO;
}

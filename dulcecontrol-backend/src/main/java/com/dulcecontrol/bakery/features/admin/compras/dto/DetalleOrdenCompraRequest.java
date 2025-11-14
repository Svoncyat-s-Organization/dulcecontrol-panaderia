package com.dulcecontrol.bakery.features.admin.compras.dto;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.UnidadMedida;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DetalleOrdenCompraRequest {

    @NotNull
    private Long insumoId;

    @NotNull
    @DecimalMin("0.0001")
    private BigDecimal cantidadSolicitada;

    @NotNull
    private UnidadMedida unidadCompra;

    @NotNull
    @Min(0)
    private Long costoUnitarioPactadoCentimos;

    @DecimalMin("0")
    private BigDecimal cantidadRecibida = BigDecimal.ZERO;

    private Boolean recibidoCompleto = Boolean.FALSE;
}

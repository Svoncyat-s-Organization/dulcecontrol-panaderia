package com.dulcecontrol.bakery.feature.admin.produccion.controller.dto;

import com.dulcecontrol.bakery.feature.admin.produccion.entity.enums.UnidadMedidaReceta;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecetaUpdateRequest {

    @NotNull
    private Long productoId;

    @NotNull
    private Long insumoId;

    @NotNull
    @DecimalMin(value = "0.0001", inclusive = true)
    private BigDecimal cantidadRequerida;

    @NotNull
    private UnidadMedidaReceta unidadMedida;

    @Size(max = 2000)
    private String notasPreparacion;
}

package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioInsumoSedeDTO {
    private Long id;

    @NotNull(message = "La sede es requerida")
    private Long sedeId;

    @NotNull(message = "El insumo es requerido")
    private Long insumoId;

    @NotNull(message = "La cantidad actual es requerida")
    @DecimalMin(value = "0.0", message = "La cantidad debe ser mayor o igual a 0")
    private BigDecimal cantidadActual;

    private String ubicacionFisica;
    private LocalDateTime actualizadoEn;
}

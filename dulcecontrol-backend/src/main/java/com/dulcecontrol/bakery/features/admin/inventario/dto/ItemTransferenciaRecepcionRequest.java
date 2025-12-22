package com.dulcecontrol.bakery.features.admin.inventario.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemTransferenciaRecepcionRequest {

    @NotNull(message = "El itemId es requerido")
    private Long itemId;

    @NotNull(message = "La cantidad recibida es requerida")
    @DecimalMin(value = "0.00", inclusive = false, message = "La cantidad recibida debe ser mayor a 0")
    private BigDecimal cantidadRecibida;
}

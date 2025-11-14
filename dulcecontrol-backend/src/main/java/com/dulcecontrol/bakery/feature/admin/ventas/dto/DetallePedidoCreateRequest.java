package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record DetallePedidoCreateRequest(
        @NotNull Long productoId,
        @NotNull @Min(1) Integer cantidad,
        @NotNull @PositiveOrZero Long precioUnitarioCentimos,
        @NotNull @PositiveOrZero Long subtotalLineaCentimos,
        String notasItem
) {
}

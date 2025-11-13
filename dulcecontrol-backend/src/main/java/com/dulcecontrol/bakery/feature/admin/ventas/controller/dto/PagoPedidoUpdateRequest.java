package com.dulcecontrol.bakery.feature.admin.ventas.controller.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.MetodoPago;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record PagoPedidoUpdateRequest(
        Long sesionCajaId,
        @NotNull @PositiveOrZero Long montoPagadoCentimos,
        @NotNull MetodoPago metodoPago,
        @Size(max = 100) String referenciaExterna,
        LocalDateTime fechaPago,
        Long registradoPor
) {
}

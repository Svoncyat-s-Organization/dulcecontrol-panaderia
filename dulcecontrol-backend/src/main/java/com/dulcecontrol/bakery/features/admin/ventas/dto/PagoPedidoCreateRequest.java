package com.dulcecontrol.bakery.features.admin.ventas.dto;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.MetodoPago;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record PagoPedidoCreateRequest(
        Long sesionCajaId,
        @NotNull @PositiveOrZero Long montoPagadoCentimos,
        @NotNull MetodoPago metodoPago,
        @Size(max = 100) String referenciaExterna,
        LocalDateTime fechaPago,
        Long registradoPor
) {
}

package com.dulcecontrol.bakery.feature.admin.ventas.controller.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoMovimientoCaja;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record MovimientoCajaCreateRequest(
        @NotNull TipoMovimientoCaja tipoMovimiento,
        @NotNull @PositiveOrZero Long montoCentimos,
        MetodoPago metodoPago,
        Long pedidoId,
        String concepto,
        @Size(max = 100) String comprobanteAsociado
) {
}

package com.dulcecontrol.bakery.features.admin.ventas.dto;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoMovimientoCaja;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record MovimientoCajaUpdateRequest(
        @NotNull TipoMovimientoCaja tipoMovimiento,
        @NotNull @PositiveOrZero Long montoCentimos,
        MetodoPago metodoPago,
        Long pedidoId,
        String concepto,
        @Size(max = 100) String comprobanteAsociado
) {
}

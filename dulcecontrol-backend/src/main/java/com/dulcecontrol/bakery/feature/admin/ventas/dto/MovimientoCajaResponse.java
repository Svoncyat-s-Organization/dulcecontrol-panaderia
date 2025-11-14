package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoMovimientoCaja;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MovimientoCajaResponse {

    private final Long id;
    private final Long sesionCajaId;
    private final TipoMovimientoCaja tipoMovimiento;
    private final Long montoCentimos;
    private final MetodoPago metodoPago;
    private final Long pedidoId;
    private final String concepto;
    private final String comprobanteAsociado;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

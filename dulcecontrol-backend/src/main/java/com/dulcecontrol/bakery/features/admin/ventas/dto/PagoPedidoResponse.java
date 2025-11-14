package com.dulcecontrol.bakery.features.admin.ventas.dto;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.MetodoPago;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PagoPedidoResponse {

    private final Long id;
    private final Long pedidoId;
    private final Long sesionCajaId;
    private final Long montoPagadoCentimos;
    private final MetodoPago metodoPago;
    private final String referenciaExterna;
    private final LocalDateTime fechaPago;
    private final Long registradoPor;
}

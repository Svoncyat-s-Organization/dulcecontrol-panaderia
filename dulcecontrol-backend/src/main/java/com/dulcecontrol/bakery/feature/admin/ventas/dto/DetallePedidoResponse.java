package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DetallePedidoResponse {

    private final Long id;
    private final Long pedidoId;
    private final Long productoId;
    private final Integer cantidad;
    private final Long precioUnitarioCentimos;
    private final Long subtotalLineaCentimos;
    private final String notasItem;
}

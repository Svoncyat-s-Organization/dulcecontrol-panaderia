package com.dulcecontrol.bakery.features.storefront.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PedidoPersonalizadoResponse(
        Long pedidoId,
        String codigoPedido,
        String nombreProducto,
        Integer cantidad,
        String descripcionSolicitud,
        String estado,
        LocalDateTime fechaCreacion
) {
}

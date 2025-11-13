package com.dulcecontrol.bakery.feature.admin.ventas.controller.dto;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.OrigenPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoComprobantePedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoEntregaPedido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record PedidoCreateRequest(
        @NotBlank @Size(max = 50) String codigoPedido,
        @NotNull Long sedeOrigenId,
        Long clienteId,
        @NotNull OrigenPedido origen,
        Long sesionCajaId,
        Long vendedorId,
        @NotNull EstadoPedido estadoPedido,
        @NotNull EstadoPagoPedido estadoPago,
        @NotNull TipoEntregaPedido tipoEntrega,
        @NotNull LocalDateTime fechaEntregaPactada,
        String direccionEntrega,
        @PositiveOrZero Long costoDeliveryCentimos,
        @Size(min = 3, max = 3) String moneda,
        @NotNull @PositiveOrZero Long subtotalItemsCentimos,
        @PositiveOrZero Long descuentoTotalCentimos,
        @PositiveOrZero Long impuestosTotalesCentimos,
        @NotNull @PositiveOrZero Long totalFinalCentimos,
        @PositiveOrZero Long montoPagadoCentimos,
        Boolean requiereComprobante,
        TipoComprobantePedido tipoComprobante,
        @Size(max = 20) String serieComprobante,
        @Size(max = 20) String numeroComprobante,
        String notasPedido
) {
}

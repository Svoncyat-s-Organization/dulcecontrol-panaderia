package com.dulcecontrol.bakery.features.admin.ventas.dto;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.OrigenPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoComprobantePedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoEntregaPedido;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PedidoResponse {

    private final Long id;
    private final Long tiendaId;
    private final String codigoPedido;
    private final Long sedeOrigenId;
    private final Long clienteId;
    private final OrigenPedido origen;
    private final Long sesionCajaId;
    private final Long vendedorId;
    private final EstadoPedido estadoPedido;
    private final EstadoPagoPedido estadoPago;
    private final TipoEntregaPedido tipoEntrega;
    private final LocalDateTime fechaEntregaPactada;
    private final String direccionEntrega;
    private final Long costoDeliveryCentimos;
    private final String moneda;
    private final Long subtotalItemsCentimos;
    private final Long descuentoTotalCentimos;
    private final Long impuestosTotalesCentimos;
    private final Long totalFinalCentimos;
    private final Long montoPagadoCentimos;
    private final Long saldoPendienteCentimos;
    private final Boolean requiereComprobante;
    private final TipoComprobantePedido tipoComprobante;
    private final String serieComprobante;
    private final String numeroComprobante;
    private final String notasPedido;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

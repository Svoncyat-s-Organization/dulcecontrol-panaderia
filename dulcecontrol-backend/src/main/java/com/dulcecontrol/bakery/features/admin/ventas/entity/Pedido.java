package com.dulcecontrol.bakery.features.admin.ventas.entity;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.OrigenPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoComprobantePedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoEntregaPedido;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos", uniqueConstraints = {
        @UniqueConstraint(name = "uk_pedidos_tienda_codigo", columnNames = {"tienda_id", "codigo_pedido"})
})
@Getter
@Setter
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_pedido", nullable = false, length = 50)
    private String codigoPedido;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_origen_id", nullable = false)
    private Long sedeOrigenId;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "origen", nullable = false, columnDefinition = "ENUM('pos_local','storefront_online','telefono')")
    private OrigenPedido origen = OrigenPedido.POS_LOCAL;

    @Column(name = "sesion_caja_id")
    private Long sesionCajaId;

    @Column(name = "vendedor_id")
    private Long vendedorId;

    @Column(name = "estado_pedido", nullable = false, columnDefinition = "ENUM('borrador','pendiente_pago','pagado','en_preparacion','listo_entrega','entregado','cancelado','devuelto')")
    private EstadoPedido estadoPedido = EstadoPedido.PENDIENTE_PAGO;

    @Column(name = "estado_pago", nullable = false, columnDefinition = "ENUM('pendiente','parcial','pagado_total','reembolsado')")
    private EstadoPagoPedido estadoPago = EstadoPagoPedido.PENDIENTE;

    @Column(name = "tipo_entrega", nullable = false, columnDefinition = "ENUM('recojo_tienda','delivery','consumo_local')")
    private TipoEntregaPedido tipoEntrega = TipoEntregaPedido.RECOJO_TIENDA;

    @Column(name = "fecha_entrega_pactada", nullable = false)
    private LocalDateTime fechaEntregaPactada;

    @Column(name = "direccion_entrega", columnDefinition = "TEXT")
    private String direccionEntrega;

    @Column(name = "costo_delivery_centimos")
    private Long costoDeliveryCentimos = 0L;

    @Column(name = "moneda", nullable = false, columnDefinition = "char(3)")
    private String moneda = "PEN";

    @Column(name = "subtotal_items_centimos", nullable = false)
    private Long subtotalItemsCentimos;

    @Column(name = "descuento_total_centimos", nullable = false)
    private Long descuentoTotalCentimos = 0L;

    @Column(name = "impuestos_totales_centimos", nullable = false)
    private Long impuestosTotalesCentimos = 0L;

    @Column(name = "total_final_centimos", nullable = false)
    private Long totalFinalCentimos;

    @Column(name = "monto_pagado_centimos", nullable = false)
    private Long montoPagadoCentimos = 0L;

    @Column(name = "saldo_pendiente_centimos", insertable = false, updatable = false, columnDefinition = "int")
    private Integer saldoPendienteCentimos;

    @Column(name = "requiere_comprobante", nullable = false)
    private Boolean requiereComprobante = Boolean.TRUE;

    @Column(name = "tipo_comprobante", columnDefinition = "ENUM('factura','boleta','nota_credito','nota_debito')")
    private TipoComprobantePedido tipoComprobante;

    @Column(name = "serie_comprobante", length = 20)
    private String serieComprobante;

    @Column(name = "numero_comprobante", length = 20)
    private String numeroComprobante;

    @Column(name = "notas_pedido", columnDefinition = "TEXT")
    private String notasPedido;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        if (fechaEntregaPactada == null) {
            fechaEntregaPactada = LocalDateTime.now();
        }
        if (costoDeliveryCentimos == null) {
            costoDeliveryCentimos = 0L;
        }
        if (descuentoTotalCentimos == null) {
            descuentoTotalCentimos = 0L;
        }
        if (impuestosTotalesCentimos == null) {
            impuestosTotalesCentimos = 0L;
        }
        if (montoPagadoCentimos == null) {
            montoPagadoCentimos = 0L;
        }
        if (requiereComprobante == null) {
            requiereComprobante = Boolean.TRUE;
        }
        if (moneda == null) {
            moneda = "PEN";
        }
        if (creadoEn == null) {
            creadoEn = LocalDateTime.now();
        }
        if (actualizadoEn == null) {
            actualizadoEn = creadoEn;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
        if (moneda == null) {
            moneda = "PEN";
        }
    }
}

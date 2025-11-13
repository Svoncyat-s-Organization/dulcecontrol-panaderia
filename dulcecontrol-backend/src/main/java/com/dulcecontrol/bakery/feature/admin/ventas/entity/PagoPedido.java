package com.dulcecontrol.bakery.feature.admin.ventas.entity;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.MetodoPago;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "pagos_pedido")
@Getter
@Setter
public class PagoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "sesion_caja_id")
    private Long sesionCajaId;

    @Column(name = "monto_pagado_centimos", nullable = false)
    private Long montoPagadoCentimos;

    @Column(name = "metodo_pago", nullable = false, columnDefinition = "ENUM('efectivo','yape','plin','tarjeta_credito','tarjeta_debito','transferencia','pasarela_online')")
    private MetodoPago metodoPago;

    @Column(name = "referencia_externa", length = 100)
    private String referenciaExterna;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "registrado_por")
    private Long registradoPor;

    @PrePersist
    void onCreate() {
        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }
    }
}

package com.dulcecontrol.bakery.features.admin.compras.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos_orden_compra")
@Data
public class PagoOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "orden_compra_id", nullable = false)
    private Long ordenCompraId;

    @Column(name = "fecha_pago", nullable = false)
    private LocalDate fechaPago;

    @Column(name = "monto_pagado_centimos", nullable = false)
    private Long montoPagadoCentimos;

    @Column(name = "metodo_pago", length = 50)
    private String metodoPago;

    @Column(name = "referencia_pago", length = 100)
    private String referenciaPago;

    @Column(name = "url_foto_comprobante", columnDefinition = "LONGTEXT")
    private String urlFotoComprobante;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (fechaPago == null) {
            fechaPago = LocalDate.now();
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

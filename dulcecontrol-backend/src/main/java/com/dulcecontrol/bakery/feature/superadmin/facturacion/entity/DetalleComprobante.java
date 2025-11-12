package com.dulcecontrol.bakery.feature.superadmin.facturacion.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "detalles_comprobante")
@Data
public class DetalleComprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comprobante_id", nullable = false)
    private Long comprobanteId;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Integer cantidad = 1;

    @Column(name = "valor_unitario_centimos", nullable = false)
    private Long valorUnitarioCentimos;

    @Column(name = "precio_unitario_centimos", nullable = false)
    private Long precioUnitarioCentimos;

    @Column(name = "igv_item_centimos", nullable = false)
    private Long igvItemCentimos;

    @Column(name = "total_item_centimos", nullable = false)
    private Long totalItemCentimos;
}
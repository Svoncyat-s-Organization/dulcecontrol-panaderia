package com.dulcecontrol.bakery.features.admin.ventas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "detalles_pedido")
@Getter
@Setter
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario_centimos", nullable = false)
    private Long precioUnitarioCentimos;

    @Column(name = "subtotal_linea_centimos", nullable = false)
    private Long subtotalLineaCentimos;

    @Column(name = "notas_item", columnDefinition = "TEXT")
    private String notasItem;
}

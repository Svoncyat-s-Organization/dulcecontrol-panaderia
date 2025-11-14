package com.dulcecontrol.bakery.features.admin.inventario.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "items_transferencia")
@Data
public class ItemTransferencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transferencia_id", nullable = false)
    private Long transferenciaId;

    @Column(name = "insumo_id")
    private Long insumoId;

    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "cantidad_enviada", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadEnviada;

    @Column(name = "cantidad_recibida", precision = 12, scale = 4)
    private BigDecimal cantidadRecibida;
}

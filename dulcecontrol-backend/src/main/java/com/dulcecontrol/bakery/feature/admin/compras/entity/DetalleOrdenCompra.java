package com.dulcecontrol.bakery.feature.admin.compras.entity;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.UnidadMedida;
import com.dulcecontrol.bakery.feature.admin.compras.entity.converter.UnidadMedidaConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_orden_compra")
@Data
public class DetalleOrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "orden_compra_id", nullable = false)
    private Long ordenCompraId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "cantidad_solicitada", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadSolicitada;

    @Convert(converter = UnidadMedidaConverter.class)
    @Column(name = "unidad_compra", nullable = false, columnDefinition = "ENUM('unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'saco', 'lata')")
    private UnidadMedida unidadCompra;

    @Column(name = "costo_unitario_pactado_centimos", nullable = false)
    private Long costoUnitarioPactadoCentimos;

    @Column(name = "total_linea_centimos", nullable = false)
    private Long totalLineaCentimos;

    @Column(name = "cantidad_recibida", precision = 12, scale = 4)
    private BigDecimal cantidadRecibida = BigDecimal.ZERO;

    @Column(name = "recibido_completo")
    private Boolean recibidoCompleto = Boolean.FALSE;

    @PrePersist
    void onCreate() {
        if (cantidadRecibida == null) {
            cantidadRecibida = BigDecimal.ZERO;
        }
        if (recibidoCompleto == null) {
            recibidoCompleto = Boolean.FALSE;
        }
    }
}

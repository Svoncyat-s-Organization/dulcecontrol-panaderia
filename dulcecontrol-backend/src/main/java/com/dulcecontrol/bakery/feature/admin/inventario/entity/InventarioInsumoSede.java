package com.dulcecontrol.bakery.feature.admin.inventario.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario_insumos_sedes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "sede_id", "insumo_id" })
})
@Data
public class InventarioInsumoSede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "cantidad_actual", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadActual = BigDecimal.ZERO;

    @Column(name = "ubicacion_fisica", length = 100)
    private String ubicacionFisica;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
        if (cantidadActual == null) {
            cantidadActual = BigDecimal.ZERO;
        }
    }
}

package com.dulcecontrol.bakery.feature.admin.inventario.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventario_productos", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "sede_id", "producto_id" })
})
@Data
public class InventarioProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "cantidad_actual", nullable = false)
    private Integer cantidadActual = 0;

    @Column(name = "ubicacion_fisica", length = 100)
    private String ubicacionFisica;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
        if (cantidadActual == null) {
            cantidadActual = 0;
        }
    }
}

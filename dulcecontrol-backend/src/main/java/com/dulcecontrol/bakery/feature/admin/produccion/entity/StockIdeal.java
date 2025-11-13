package com.dulcecontrol.bakery.feature.admin.produccion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "stock_ideal")
@Getter
@Setter
public class StockIdeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "cantidad_ideal", nullable = false)
    private Integer cantidadIdeal;

    @Column(name = "punto_reposicion")
    private Integer puntoReposicion;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        actualizadoEn = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

package com.dulcecontrol.bakery.features.admin.produccion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "conteos_diarios",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_conteo_sede_fecha", columnNames = {"sede_id", "fecha_conteo"})
        }
)
@Getter
@Setter
public class ConteoDiario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "fecha_conteo", nullable = false)
    private LocalDate fechaConteo;

    @Column(name = "responsable_id")
    private Long responsableId;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}

package com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "planes")
@Getter
@Setter
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "precio_mensual_centimos", nullable = false)
    private Long precioMensualCentimos;

    @Column(name = "precio_anual_centimos", nullable = false)
    private Long precioAnualCentimos;

    @Column(name = "moneda", columnDefinition = "char(3)")
    private String moneda = "PEN";

    @Column(name = "limites", nullable = false, columnDefinition = "JSON")
    private String limitesJson;

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        LocalDateTime ahora = LocalDateTime.now();
        creadoEn = ahora;
        actualizadoEn = ahora;
        if (activo == null) {
            activo = Boolean.TRUE;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

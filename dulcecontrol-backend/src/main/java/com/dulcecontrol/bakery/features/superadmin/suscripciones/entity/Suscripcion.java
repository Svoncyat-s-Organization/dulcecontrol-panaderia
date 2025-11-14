package com.dulcecontrol.bakery.features.superadmin.suscripciones.entity;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.CicloSuscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "suscripciones")
@Getter
@Setter
public class Suscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('mensual','anual')")
    private CicloSuscripcion ciclo = CicloSuscripcion.MENSUAL;

    @Column(name = "precio_pactado_centimos", nullable = false)
    private Long precioPactadoCentimos;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('en_prueba','activa','vencida','cancelada')")
    private EstadoSuscripcion estado = EstadoSuscripcion.EN_PRUEBA;

    @Column(nullable = false)
    private Boolean autorenovar = Boolean.TRUE;

    @Column(name = "cancelado_en")
    private LocalDateTime canceladoEn;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        LocalDateTime ahora = LocalDateTime.now();
        if (fechaInicio == null) {
            fechaInicio = ahora;
        }
        creadoEn = ahora;
        actualizadoEn = ahora;
        if (autorenovar == null) {
            autorenovar = Boolean.TRUE;
        }
        if (estado == null) {
            estado = EstadoSuscripcion.EN_PRUEBA;
        }
        if (ciclo == null) {
            ciclo = CicloSuscripcion.MENSUAL;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

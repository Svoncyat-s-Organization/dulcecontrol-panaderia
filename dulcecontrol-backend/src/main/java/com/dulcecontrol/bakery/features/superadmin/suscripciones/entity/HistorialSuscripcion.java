package com.dulcecontrol.bakery.features.superadmin.suscripciones.entity;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.TipoMovimientoSuscripcion;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_suscripciones")
@Getter
@Setter
public class HistorialSuscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suscripcion_id", nullable = false)
    private Suscripcion suscripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_anterior_id")
    private Plan planAnterior;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_nuevo_id", nullable = false)
    private Plan planNuevo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimiento", nullable = false)
    private TipoMovimientoSuscripcion tipoMovimiento;

    @Column(name = "precio_anterior_centimos")
    private Long precioAnteriorCentimos;

    @Column(name = "precio_nuevo_centimos", nullable = false)
    private Long precioNuevoCentimos;

    @Column(name = "fecha_movimiento", nullable = false)
    private LocalDateTime fechaMovimiento;

    @Column(name = "usuario_responsable_id")
    private Long usuarioResponsableId;

    @PrePersist
    void onCreate() {
        if (fechaMovimiento == null) {
            fechaMovimiento = LocalDateTime.now();
        }
    }
}

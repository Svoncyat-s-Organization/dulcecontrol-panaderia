package com.dulcecontrol.bakery.features.admin.produccion.entity;

import com.dulcecontrol.bakery.features.admin.produccion.entity.converter.EstadoPlanProduccionConverter;
import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.EstadoPlanProduccion;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "planes_produccion",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_planes_sede_fecha", columnNames = {"sede_id", "fecha_produccion"})
        }
)
@Getter
@Setter
public class PlanProduccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "fecha_produccion", nullable = false)
    private LocalDate fechaProduccion;

    @Convert(converter = EstadoPlanProduccionConverter.class)
    @Column(name = "estado", nullable = false, length = 20)
    private EstadoPlanProduccion estado;

    @Column(name = "generado_por")
    private Long generadoPor;

    @Column(name = "confirmado_por")
    private Long confirmadoPor;

    @Column(name = "hora_inicio_real")
    private LocalDateTime horaInicioReal;

    @Column(name = "hora_fin_real")
    private LocalDateTime horaFinReal;

    @Column(name = "notas_maestro")
    private String notasMaestro;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        creadoEn = now;
        actualizadoEn = now;
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

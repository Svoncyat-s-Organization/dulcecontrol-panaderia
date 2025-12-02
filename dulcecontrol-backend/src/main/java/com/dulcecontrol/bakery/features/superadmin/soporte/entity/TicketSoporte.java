package com.dulcecontrol.bakery.features.superadmin.soporte.entity;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.converter.EstadoTicketConverter;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.converter.PrioridadTicketConverter;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.PrioridadTicket;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "tickets_soporte")
@Data
public class TicketSoporte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "asignado_a_id")
    private Long asignadoAId;

    @Column(nullable = false, length = 255)
    private String asunto;

    @Convert(converter = PrioridadTicketConverter.class)
    @Column(name = "prioridad", nullable = false, columnDefinition = "ENUM('baja','media','alta','critica')")
    private PrioridadTicket prioridad = PrioridadTicket.media;

    @Convert(converter = EstadoTicketConverter.class)
    @Column(name = "estado", nullable = false, columnDefinition = "ENUM('abierto','pendiente_cliente','resuelto','cerrado')")
    private EstadoTicket estado = EstadoTicket.abierto;

    @Column(name = "vencimiento_sla_en")
    private LocalDateTime vencimientoSlaEn;

    @Column(name = "primera_respuesta_en")
    private LocalDateTime primeraRespuestaEn;

    @Column(name = "resuelto_en")
    private LocalDateTime resueltoEn;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (prioridad == null) prioridad = PrioridadTicket.media;
        if (estado == null) estado = EstadoTicket.abierto;
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
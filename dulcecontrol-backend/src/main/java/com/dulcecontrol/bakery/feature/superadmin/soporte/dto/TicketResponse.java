package com.dulcecontrol.bakery.feature.superadmin.soporte.dto;

import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.PrioridadTicket;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class TicketResponse {
    private final Long id;
    private final Long tiendaId;
    private final Long asignadoAId;
    private final String asunto;
    private final PrioridadTicket prioridad;
    private final EstadoTicket estado;
    private final LocalDateTime vencimientoSlaEn;
    private final LocalDateTime primeraRespuestaEn;
    private final LocalDateTime resueltoEn;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}
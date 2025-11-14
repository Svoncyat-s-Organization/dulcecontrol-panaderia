package com.dulcecontrol.bakery.features.superadmin.soporte.dto;

import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.PrioridadTicket;
import lombok.Getter;

@Getter
public class TicketUpdateRequest {
    private Long asignadoAId;
    private PrioridadTicket prioridad;
    private EstadoTicket estado;
}
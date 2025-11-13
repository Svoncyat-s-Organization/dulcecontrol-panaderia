package com.dulcecontrol.bakery.feature.superadmin.soporte.service;

import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketResponse;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.TicketUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.enums.PrioridadTicket;

import java.util.List;

public interface ITicketSoporteService {
    List<TicketResponse> listar(Long tiendaId, EstadoTicket estado, PrioridadTicket prioridad);
    TicketResponse obtener(Long id);
    TicketResponse crear(TicketCreateRequest request);
    TicketResponse actualizar(Long id, TicketUpdateRequest request);
    void eliminar(Long id);
}
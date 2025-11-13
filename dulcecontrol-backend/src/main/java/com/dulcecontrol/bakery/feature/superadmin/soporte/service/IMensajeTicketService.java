package com.dulcecontrol.bakery.feature.superadmin.soporte.service;

import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeResponse;

import java.util.List;

public interface IMensajeTicketService {
    List<MensajeResponse> listarPorTicket(Long ticketId);
    List<MensajeResponse> listarTodos();
    MensajeResponse crear(MensajeCreateRequest request);
    MensajeResponse obtener(Long id);
    MensajeResponse actualizar(Long id, com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeUpdateRequest request);
    void eliminar(Long id);
}
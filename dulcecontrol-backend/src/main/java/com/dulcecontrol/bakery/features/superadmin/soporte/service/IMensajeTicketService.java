package com.dulcecontrol.bakery.features.superadmin.soporte.service;

import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeResponse;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.MensajeUpdateRequest;

import java.util.List;

public interface IMensajeTicketService {
    List<MensajeResponse> listarPorTicket(Long ticketId);
    List<MensajeResponse> listarTodos();
    MensajeResponse crear(MensajeCreateRequest request);
    MensajeResponse obtener(Long id);
    MensajeResponse actualizar(Long id, MensajeUpdateRequest request);
    void eliminar(Long id);
}
package com.dulcecontrol.bakery.features.superadmin.soporte.service.impl;

import com.dulcecontrol.bakery.features.superadmin.soporte.dto.TicketCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.TicketResponse;
import com.dulcecontrol.bakery.features.superadmin.soporte.dto.TicketUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.TicketSoporte;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.EstadoTicket;
import com.dulcecontrol.bakery.features.superadmin.soporte.entity.enums.PrioridadTicket;
import com.dulcecontrol.bakery.features.superadmin.soporte.repository.TicketSoporteRepository;
import com.dulcecontrol.bakery.features.superadmin.soporte.service.ITicketSoporteService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketSoporteService implements ITicketSoporteService {

    private final TicketSoporteRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponse> listar(Long tiendaId, EstadoTicket estado, PrioridadTicket prioridad) {
        List<TicketSoporte> items;
        if (tiendaId != null) {
            items = ticketRepository.findByTiendaIdOrderByPrioridadDesc(tiendaId);
        } else if (estado != null) {
            items = ticketRepository.findByEstadoOrderByCreadoEnDesc(estado);
        } else if (prioridad != null) {
            items = ticketRepository.findByPrioridadOrderByCreadoEnDesc(prioridad);
        } else {
            items = ticketRepository.findAll();
        }
        return items.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse obtener(Long id) {
        TicketSoporte t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));
        return toResponse(t);
    }

    @Override
    @Transactional
    public TicketResponse crear(TicketCreateRequest request) {
        TicketSoporte t = new TicketSoporte();
        t.setTiendaId(request.getTiendaId());
        t.setAsignadoAId(request.getAsignadoAId());
        t.setAsunto(request.getAsunto());
        t.setPrioridad(request.getPrioridad());
        TicketSoporte saved = ticketRepository.save(t);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public TicketResponse actualizar(Long id, TicketUpdateRequest request) {
        TicketSoporte t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));
        if (request.getAsignadoAId() != null) t.setAsignadoAId(request.getAsignadoAId());
        if (request.getPrioridad() != null) t.setPrioridad(request.getPrioridad());
        if (request.getEstado() != null) t.setEstado(request.getEstado());
        TicketSoporte updated = ticketRepository.save(t);
        return toResponse(updated);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        TicketSoporte t = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket no encontrado"));
        ticketRepository.delete(t);
    }

    private TicketResponse toResponse(TicketSoporte t) {
        return TicketResponse.builder()
                .id(t.getId())
                .tiendaId(t.getTiendaId())
                .asignadoAId(t.getAsignadoAId())
                .asunto(t.getAsunto())
                .prioridad(t.getPrioridad())
                .estado(t.getEstado())
                .vencimientoSlaEn(t.getVencimientoSlaEn())
                .primeraRespuestaEn(t.getPrimeraRespuestaEn())
                .resueltoEn(t.getResueltoEn())
                .creadoEn(t.getCreadoEn())
                .actualizadoEn(t.getActualizadoEn())
                .build();
    }
}
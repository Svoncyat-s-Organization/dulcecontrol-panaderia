package com.dulcecontrol.bakery.feature.superadmin.soporte.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeResponse;
import com.dulcecontrol.bakery.feature.superadmin.soporte.entity.MensajeTicket;
import com.dulcecontrol.bakery.feature.superadmin.soporte.repository.MensajeTicketRepository;
import com.dulcecontrol.bakery.feature.superadmin.soporte.service.IMensajeTicketService;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MensajeTicketService implements IMensajeTicketService {

    private final MensajeTicketRepository mensajeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MensajeResponse> listarPorTicket(Long ticketId) {
        return mensajeRepository.findByTicketIdOrderByCreadoEnAsc(ticketId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MensajeResponse> listarTodos() {
        return mensajeRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public MensajeResponse crear(MensajeCreateRequest request) {
        MensajeTicket m = new MensajeTicket();
        m.setTicketId(request.getTicketId());
        m.setTipoRemitente(request.getTipoRemitente());
        m.setAutorAdminId(request.getAutorAdminId());
        m.setMensaje(request.getMensaje());
        m.setEsNotaInterna(Boolean.TRUE.equals(request.getEsNotaInterna()));
        MensajeTicket saved = mensajeRepository.save(m);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public MensajeResponse obtener(Long id) {
        MensajeTicket m = mensajeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
        return toResponse(m);
    }

    @Override
    @Transactional
    public MensajeResponse actualizar(Long id, com.dulcecontrol.bakery.feature.superadmin.soporte.controller.dto.MensajeUpdateRequest request) {
        MensajeTicket m = mensajeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
        if (request.getMensaje() != null) m.setMensaje(request.getMensaje());
        if (request.getEsNotaInterna() != null) m.setEsNotaInterna(request.getEsNotaInterna());
        MensajeTicket updated = mensajeRepository.save(m);
        return toResponse(updated);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        MensajeTicket m = mensajeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
        mensajeRepository.delete(m);
    }

    private MensajeResponse toResponse(MensajeTicket m) {
        return MensajeResponse.builder()
                .id(m.getId())
                .ticketId(m.getTicketId())
                .tipoRemitente(m.getTipoRemitente())
                .autorAdminId(m.getAutorAdminId())
                .mensaje(m.getMensaje())
                .esNotaInterna(m.getEsNotaInterna())
                .leidoEn(m.getLeidoEn())
                .creadoEn(m.getCreadoEn())
                .build();
    }
}
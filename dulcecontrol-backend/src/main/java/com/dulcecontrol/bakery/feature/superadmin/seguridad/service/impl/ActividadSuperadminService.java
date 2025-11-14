package com.dulcecontrol.bakery.feature.superadmin.seguridad.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.seguridad.dto.ActividadSuperadminCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.dto.ActividadSuperadminResponse;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.entity.ActividadSuperadmin;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.entity.UsuarioSuperadmin;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.repository.ActividadSuperadminRepository;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.service.IActividadSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActividadSuperadminService implements IActividadSuperadminService {

    private static final int LIMITE_DEFECTO = 50;
    private static final int LIMITE_MAXIMO = 200;

    private final ActividadSuperadminRepository actividadRepository;
    private final UsuarioSuperadminRepository usuarioRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<ActividadSuperadminResponse> listarRecientes(int limite) {
        Pageable pageable = buildPageable(limite);
        Page<ActividadSuperadmin> pagina = actividadRepository.findAll(pageable);
        return pagina.getContent().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActividadSuperadminResponse> listarPorSuperadmin(Long superadminId, int limite) {
        Pageable pageable = buildPageable(limite);
        Page<ActividadSuperadmin> pagina = actividadRepository.findBySuperadminId(superadminId, pageable);
        return pagina.getContent().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public ActividadSuperadminResponse registrar(Long superadminId, ActividadSuperadminCreateRequest request) {
        UsuarioSuperadmin superadmin = usuarioRepository.findById(superadminId)
                .orElseThrow(() -> new ResourceNotFoundException("Superadministrador no encontrado"));

        ActividadSuperadmin actividad = new ActividadSuperadmin();
        actividad.setSuperadmin(superadmin);
        actividad.setTipoEvento(request.getTipoEvento());
        actividad.setIpOrigen(request.getIpOrigen());
        actividad.setDetallesJson(serializarDetalles(request.getDetalles()));

        ActividadSuperadmin guardada = actividadRepository.save(actividad);
        return toResponse(guardada);
    }

    private Pageable buildPageable(int limiteSolicitado) {
        int limiteNormalizado = limiteSolicitado <= 0 ? LIMITE_DEFECTO : Math.min(limiteSolicitado, LIMITE_MAXIMO);
        return PageRequest.of(0, limiteNormalizado, Sort.by(Sort.Direction.DESC, "creadoEn"));
    }

    private String serializarDetalles(JsonNode detalles) {
        if (detalles == null || detalles.isNull() || detalles.isMissingNode()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(detalles);
        } catch (JsonProcessingException ex) {
            throw new BadRequestException("No fue posible serializar los detalles de la actividad");
        }
    }

    private JsonNode deserializarDetalles(String detallesJson) {
        if (detallesJson == null || detallesJson.isBlank()) {
            return objectMapper.nullNode();
        }
        try {
            return objectMapper.readTree(detallesJson);
        } catch (JsonProcessingException ex) {
            return objectMapper.nullNode();
        }
    }

    private ActividadSuperadminResponse toResponse(ActividadSuperadmin actividad) {
        return ActividadSuperadminResponse.builder()
                .id(actividad.getId())
                .superadminId(actividad.getSuperadmin() != null ? actividad.getSuperadmin().getId() : null)
                .tipoEvento(actividad.getTipoEvento())
                .ipOrigen(actividad.getIpOrigen())
                .detalles(deserializarDetalles(actividad.getDetallesJson()))
                .creadoEn(actividad.getCreadoEn())
                .build();
    }
}

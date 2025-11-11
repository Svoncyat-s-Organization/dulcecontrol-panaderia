package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.Plan;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository.PlanRepository;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.IPlanSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanSuperadminService implements IPlanSuperadminService {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "creadoEn");

    private final PlanRepository planRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PlanResponse> listar(Boolean soloActivos) {
        List<Plan> planes = Boolean.TRUE.equals(soloActivos)
                ? planRepository.findByActivoTrue(DEFAULT_SORT)
                : planRepository.findAll(DEFAULT_SORT);
        return planes.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PlanResponse obtener(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));
        return toResponse(plan);
    }

    @Override
    @Transactional
    public PlanResponse crear(PlanCreateRequest request) {
        String codigoNormalizado = normalizarCodigo(request.getCodigo());
        if (planRepository.existsByCodigo(codigoNormalizado)) {
            throw new BadRequestException("Ya existe un plan con ese código");
        }

        Plan plan = new Plan();
        plan.setCodigo(codigoNormalizado);
        plan.setNombre(request.getNombre().trim());
        plan.setDescripcion(normalizarTexto(request.getDescripcion()));
        plan.setPrecioMensualCentimos(request.getPrecioMensualCentimos());
        plan.setPrecioAnualCentimos(request.getPrecioAnualCentimos());
        plan.setMoneda(request.getMoneda().toUpperCase());
        plan.setLimitesJson(serializarLimites(request.getLimites()));
        plan.setActivo(request.getActivo() != null ? request.getActivo() : Boolean.TRUE);

        Plan guardado = planRepository.save(plan);
        return toResponse(guardado);
    }

    @Override
    @Transactional
    public PlanResponse actualizar(Long id, PlanUpdateRequest request) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));

        String codigoNormalizado = normalizarCodigo(request.getCodigo());
        if (planRepository.existsByCodigoAndIdNot(codigoNormalizado, id)) {
            throw new BadRequestException("Ya existe otro plan con ese código");
        }

        plan.setCodigo(codigoNormalizado);
        plan.setNombre(request.getNombre().trim());
        plan.setDescripcion(normalizarTexto(request.getDescripcion()));
        plan.setPrecioMensualCentimos(request.getPrecioMensualCentimos());
        plan.setPrecioAnualCentimos(request.getPrecioAnualCentimos());
        plan.setMoneda(request.getMoneda().toUpperCase());
        plan.setLimitesJson(serializarLimites(request.getLimites()));
        if (request.getActivo() != null) {
            plan.setActivo(request.getActivo());
        }

        Plan actualizado = planRepository.save(plan);
        return toResponse(actualizado);
    }

    private String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    private String normalizarTexto(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    private String serializarLimites(JsonNode limites) {
        try {
            return objectMapper.writeValueAsString(limites == null ? objectMapper.createObjectNode() : limites);
        } catch (JsonProcessingException e) {
            throw new BadRequestException("Los límites del plan no tienen un formato válido");
        }
    }

    private JsonNode deserializarLimites(String limitesJson) {
        if (limitesJson == null || limitesJson.isBlank()) {
            return objectMapper.createObjectNode();
        }
        try {
            return objectMapper.readTree(limitesJson);
        } catch (JsonProcessingException e) {
            return objectMapper.createObjectNode();
        }
    }

    private PlanResponse toResponse(Plan plan) {
        return PlanResponse.builder()
                .id(plan.getId())
                .codigo(plan.getCodigo())
                .nombre(plan.getNombre())
                .descripcion(plan.getDescripcion())
                .precioMensualCentimos(plan.getPrecioMensualCentimos())
                .precioAnualCentimos(plan.getPrecioAnualCentimos())
                .moneda(plan.getMoneda())
                .limites(deserializarLimites(plan.getLimitesJson()))
                .activo(plan.getActivo())
                .creadoEn(plan.getCreadoEn())
                .actualizadoEn(plan.getActualizadoEn())
                .build();
    }
}

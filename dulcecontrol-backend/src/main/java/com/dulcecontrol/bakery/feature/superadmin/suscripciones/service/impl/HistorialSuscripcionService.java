package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.HistorialSuscripcionResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.HistorialSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository.HistorialSuscripcionRepository;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.IHistorialSuscripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HistorialSuscripcionService implements IHistorialSuscripcionService {

    private final HistorialSuscripcionRepository historialRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HistorialSuscripcionResponse> listarPorSuscripcion(Long suscripcionId) {
        return historialRepository.findBySuscripcionIdOrderByFechaMovimientoDesc(suscripcionId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private HistorialSuscripcionResponse toResponse(HistorialSuscripcion historial) {
        return HistorialSuscripcionResponse.builder()
                .id(historial.getId())
                .suscripcionId(historial.getSuscripcion() != null ? historial.getSuscripcion().getId() : null)
                .planAnteriorId(historial.getPlanAnterior() != null ? historial.getPlanAnterior().getId() : null)
                .planAnteriorNombre(
                        historial.getPlanAnterior() != null ? historial.getPlanAnterior().getNombre() : null)
                .planNuevoId(historial.getPlanNuevo() != null ? historial.getPlanNuevo().getId() : null)
                .planNuevoNombre(historial.getPlanNuevo() != null ? historial.getPlanNuevo().getNombre() : null)
                .tipoMovimiento(historial.getTipoMovimiento())
                .precioAnteriorCentimos(historial.getPrecioAnteriorCentimos())
                .precioNuevoCentimos(historial.getPrecioNuevoCentimos())
                .fechaMovimiento(historial.getFechaMovimiento())
                .usuarioResponsableId(historial.getUsuarioResponsableId())
                .build();
    }
}

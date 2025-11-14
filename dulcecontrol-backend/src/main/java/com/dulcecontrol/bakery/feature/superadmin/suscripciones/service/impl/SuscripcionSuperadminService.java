package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.impl;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.dto.SuscripcionCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.dto.SuscripcionResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.dto.SuscripcionUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.HistorialSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.Plan;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.Suscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.TipoMovimientoSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository.HistorialSuscripcionRepository;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository.PlanRepository;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository.SuscripcionRepository;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.service.ISuscripcionSuperadminService;
import com.dulcecontrol.bakery.shared.exception.BadRequestException;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuscripcionSuperadminService implements ISuscripcionSuperadminService {

    private final SuscripcionRepository suscripcionRepository;
    private final PlanRepository planRepository;
    private final HistorialSuscripcionRepository historialRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SuscripcionResponse> listar(Long tiendaId, EstadoSuscripcion estado) {
        List<Suscripcion> suscripciones;
        if (tiendaId != null && estado != null) {
            suscripciones = suscripcionRepository.findByTiendaIdAndEstado(tiendaId, estado);
        } else if (tiendaId != null) {
            suscripciones = suscripcionRepository.findByTiendaId(tiendaId);
        } else if (estado != null) {
            suscripciones = suscripcionRepository.findByEstado(estado);
        } else {
            suscripciones = suscripcionRepository.findAll();
        }

        return suscripciones.stream()
                .sorted(Comparator.comparing(Suscripcion::getFechaFin).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SuscripcionResponse obtener(Long id) {
        Suscripcion suscripcion = suscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suscripción no encontrada"));
        return toResponse(suscripcion);
    }

    @Override
    @Transactional
    public SuscripcionResponse crear(SuscripcionCreateRequest request) {
        Plan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));

        LocalDateTime fechaInicio = request.getFechaInicio() != null
                ? request.getFechaInicio()
                : LocalDateTime.now();
        if (request.getFechaFin().isBefore(fechaInicio)) {
            throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        Suscripcion suscripcion = new Suscripcion();
        suscripcion.setTiendaId(request.getTiendaId());
        suscripcion.setPlan(plan);
        suscripcion.setCiclo(request.getCiclo());
        suscripcion.setPrecioPactadoCentimos(request.getPrecioPactadoCentimos());
        suscripcion.setFechaInicio(fechaInicio);
        suscripcion.setFechaFin(request.getFechaFin());
        suscripcion.setEstado(request.getEstado() != null ? request.getEstado() : EstadoSuscripcion.EN_PRUEBA);
        suscripcion.setAutorenovar(request.getAutorenovar() != null ? request.getAutorenovar() : Boolean.TRUE);

        Suscripcion guardada = suscripcionRepository.save(suscripcion);
        registrarHistorial(guardada, null, plan, TipoMovimientoSuscripcion.ALTA,
                null, guardada.getPrecioPactadoCentimos(), request.getUsuarioResponsableId());
        return toResponse(guardada);
    }

    @Override
    @Transactional
    public SuscripcionResponse actualizar(Long id, SuscripcionUpdateRequest request) {
        Suscripcion suscripcion = suscripcionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suscripción no encontrada"));

        Plan planAnterior = suscripcion.getPlan();
        Long precioAnterior = suscripcion.getPrecioPactadoCentimos();
        EstadoSuscripcion estadoAnterior = suscripcion.getEstado();
        LocalDateTime fechaFinAnterior = suscripcion.getFechaFin();
        LocalDateTime fechaInicioAnterior = suscripcion.getFechaInicio();

        if (request.getPlanId() != null && !request.getPlanId().equals(planAnterior.getId())) {
            Plan nuevoPlan = planRepository.findById(request.getPlanId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plan no encontrado"));
            suscripcion.setPlan(nuevoPlan);
        }

        if (request.getCiclo() != null) {
            suscripcion.setCiclo(request.getCiclo());
        }

        if (request.getPrecioPactadoCentimos() != null) {
            suscripcion.setPrecioPactadoCentimos(request.getPrecioPactadoCentimos());
        }

        if (request.getFechaInicio() != null) {
            suscripcion.setFechaInicio(request.getFechaInicio());
        }

        if (request.getFechaFin() != null) {
            suscripcion.setFechaFin(request.getFechaFin());
        }

        if (suscripcion.getFechaFin().isBefore(suscripcion.getFechaInicio())) {
            throw new BadRequestException("La fecha de fin debe ser posterior a la fecha de inicio");
        }

        if (request.getEstado() != null) {
            suscripcion.setEstado(request.getEstado());
        }

        if (request.getAutorenovar() != null) {
            suscripcion.setAutorenovar(request.getAutorenovar());
        }

        ajustarCancelacion(suscripcion, estadoAnterior);

        Suscripcion actualizada = suscripcionRepository.save(suscripcion);

        TipoMovimientoSuscripcion tipoMovimiento = resolverMovimiento(planAnterior, actualizada.getPlan(),
                estadoAnterior, actualizada.getEstado(), fechaFinAnterior, actualizada.getFechaFin(),
                fechaInicioAnterior, actualizada.getFechaInicio(), precioAnterior,
                actualizada.getPrecioPactadoCentimos());

        if (tipoMovimiento != null) {
            registrarHistorial(actualizada, planAnterior, actualizada.getPlan(), tipoMovimiento,
                    precioAnterior, actualizada.getPrecioPactadoCentimos(), request.getUsuarioResponsableId());
        }

        return toResponse(actualizada);
    }

    private void ajustarCancelacion(Suscripcion suscripcion, EstadoSuscripcion estadoAnterior) {
        if (suscripcion.getEstado() == EstadoSuscripcion.CANCELADA && estadoAnterior != EstadoSuscripcion.CANCELADA) {
            suscripcion.setCanceladoEn(LocalDateTime.now());
        } else if (estadoAnterior == EstadoSuscripcion.CANCELADA
                && suscripcion.getEstado() != EstadoSuscripcion.CANCELADA) {
            suscripcion.setCanceladoEn(null);
        }
    }

    private void registrarHistorial(Suscripcion suscripcion, Plan planAnterior, Plan planNuevo,
            TipoMovimientoSuscripcion tipoMovimiento,
            Long precioAnterior, Long precioNuevo, Long usuarioResponsableId) {
        HistorialSuscripcion historial = new HistorialSuscripcion();
        historial.setSuscripcion(suscripcion);
        historial.setPlanAnterior(planAnterior);
        historial.setPlanNuevo(planNuevo);
        historial.setTipoMovimiento(tipoMovimiento);
        historial.setPrecioAnteriorCentimos(precioAnterior);
        historial.setPrecioNuevoCentimos(precioNuevo);
        historial.setUsuarioResponsableId(usuarioResponsableId);
        historialRepository.save(historial);
    }

    private TipoMovimientoSuscripcion resolverMovimiento(Plan planAnterior, Plan planNuevo,
            EstadoSuscripcion estadoAnterior, EstadoSuscripcion estadoNuevo,
            LocalDateTime fechaFinAnterior, LocalDateTime fechaFinNueva,
            LocalDateTime fechaInicioAnterior, LocalDateTime fechaInicioNuevo,
            Long precioAnterior, Long precioNuevo) {
        boolean cambioPlan = planAnterior != null && planNuevo != null
                && !planAnterior.getId().equals(planNuevo.getId());
        boolean cambioEstado = estadoAnterior != estadoNuevo;
        boolean cambioFechas = !fechaFinAnterior.equals(fechaFinNueva) || !fechaInicioAnterior.equals(fechaInicioNuevo);
        boolean cambioPrecio = !precioAnterior.equals(precioNuevo);

        if (cambioPlan) {
            if (precioAnterior != null && precioNuevo != null && precioNuevo > precioAnterior) {
                return TipoMovimientoSuscripcion.UPGRADE;
            }
            if (precioAnterior != null && precioNuevo != null && precioNuevo < precioAnterior) {
                return TipoMovimientoSuscripcion.DOWNGRADE;
            }
            return TipoMovimientoSuscripcion.RENOVACION;
        }

        if (cambioEstado) {
            if (estadoNuevo == EstadoSuscripcion.CANCELADA) {
                return TipoMovimientoSuscripcion.CANCELACION;
            }
            if (estadoAnterior == EstadoSuscripcion.CANCELADA && estadoNuevo != EstadoSuscripcion.CANCELADA) {
                return TipoMovimientoSuscripcion.REACTIVACION;
            }
        }

        if (cambioFechas || cambioPrecio) {
            return TipoMovimientoSuscripcion.RENOVACION;
        }

        return null;
    }

    private SuscripcionResponse toResponse(Suscripcion suscripcion) {
        Plan plan = suscripcion.getPlan();
        return SuscripcionResponse.builder()
                .id(suscripcion.getId())
                .tiendaId(suscripcion.getTiendaId())
                .planId(plan != null ? plan.getId() : null)
                .planCodigo(plan != null ? plan.getCodigo() : null)
                .planNombre(plan != null ? plan.getNombre() : null)
                .planPrecioMensualCentimos(plan != null ? plan.getPrecioMensualCentimos() : null)
                .planPrecioAnualCentimos(plan != null ? plan.getPrecioAnualCentimos() : null)
                .planActivo(plan != null ? plan.getActivo() : null)
                .ciclo(suscripcion.getCiclo())
                .precioPactadoCentimos(suscripcion.getPrecioPactadoCentimos())
                .fechaInicio(suscripcion.getFechaInicio())
                .fechaFin(suscripcion.getFechaFin())
                .estado(suscripcion.getEstado())
                .autorenovar(suscripcion.getAutorenovar())
                .canceladoEn(suscripcion.getCanceladoEn())
                .creadoEn(suscripcion.getCreadoEn())
                .actualizadoEn(suscripcion.getActualizadoEn())
                .build();
    }
}

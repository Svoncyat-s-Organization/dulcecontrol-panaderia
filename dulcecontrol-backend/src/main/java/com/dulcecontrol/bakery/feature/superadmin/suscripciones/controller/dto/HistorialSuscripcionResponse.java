package com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.TipoMovimientoSuscripcion;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class HistorialSuscripcionResponse {

    private final Long id;
    private final Long suscripcionId;
    private final Long planAnteriorId;
    private final String planAnteriorNombre;
    private final Long planNuevoId;
    private final String planNuevoNombre;
    private final TipoMovimientoSuscripcion tipoMovimiento;
    private final Long precioAnteriorCentimos;
    private final Long precioNuevoCentimos;
    private final LocalDateTime fechaMovimiento;
    private final Long usuarioResponsableId;
}

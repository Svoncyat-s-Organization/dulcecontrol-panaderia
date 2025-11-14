package com.dulcecontrol.bakery.feature.superadmin.suscripciones.dto;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.CicloSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SuscripcionResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long planId;
    private final String planCodigo;
    private final String planNombre;
    private final Long planPrecioMensualCentimos;
    private final Long planPrecioAnualCentimos;
    private final Boolean planActivo;
    private final CicloSuscripcion ciclo;
    private final Long precioPactadoCentimos;
    private final LocalDateTime fechaInicio;
    private final LocalDateTime fechaFin;
    private final EstadoSuscripcion estado;
    private final Boolean autorenovar;
    private final LocalDateTime canceladoEn;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

package com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PlanResponse {

    private final Long id;
    private final String codigo;
    private final String nombre;
    private final String descripcion;
    private final Long precioMensualCentimos;
    private final Long precioAnualCentimos;
    private final String moneda;
    private final JsonNode limites;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

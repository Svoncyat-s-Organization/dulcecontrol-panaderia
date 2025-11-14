package com.dulcecontrol.bakery.feature.superadmin.seguridad.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ActividadSuperadminResponse {

    private final Long id;
    private final Long superadminId;
    private final String tipoEvento;
    private final String ipOrigen;
    private final JsonNode detalles;
    private final LocalDateTime creadoEn;
}

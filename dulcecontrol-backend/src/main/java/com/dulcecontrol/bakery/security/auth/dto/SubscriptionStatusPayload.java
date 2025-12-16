package com.dulcecontrol.bakery.security.auth.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SubscriptionStatusPayload {

    private final Long id;
    private final String estado;
    private final String planNombre;
    private final Long planId;
    private final String planCodigo;
    private final String ciclo;
    private final Boolean autorenovar;
    private final LocalDateTime fechaInicio;
    private final LocalDateTime fechaFin;
    private final Long remainingSeconds;
    private final Boolean enPeriodoPrueba;
}

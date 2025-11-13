package com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.CicloSuscripcion;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SuscripcionUpdateRequest {

    private Long planId;

    private CicloSuscripcion ciclo;

    @Positive
    private Long precioPactadoCentimos;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private EstadoSuscripcion estado;

    private Boolean autorenovar;

    private Long usuarioResponsableId;
}

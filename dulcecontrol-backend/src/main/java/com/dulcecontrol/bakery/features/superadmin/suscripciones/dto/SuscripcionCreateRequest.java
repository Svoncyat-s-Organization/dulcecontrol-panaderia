package com.dulcecontrol.bakery.features.superadmin.suscripciones.dto;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.CicloSuscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SuscripcionCreateRequest {

    @NotNull
    private Long tiendaId;

    @NotNull
    private Long planId;

    @NotNull
    private CicloSuscripcion ciclo;

    @NotNull
    @Positive
    private Long precioPactadoCentimos;

    private LocalDateTime fechaInicio;

    @NotNull
    private LocalDateTime fechaFin;

    private EstadoSuscripcion estado;

    private Boolean autorenovar;

    private Long usuarioResponsableId;
}

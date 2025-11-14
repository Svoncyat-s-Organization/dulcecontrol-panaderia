package com.dulcecontrol.bakery.features.admin.ventas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record SesionCajaCreateRequest(
        @NotNull Long cajaId,
        @NotNull Long usuarioAperturaId,
        Long usuarioCierreId,
        @NotNull @PositiveOrZero Long montoInicialCentimos,
        Long montoFinalEsperadoCentimos,
        Long montoFinalRealCentimos,
        LocalDateTime fechaApertura,
        LocalDateTime fechaCierre,
        Boolean estaAbierta
) {
}

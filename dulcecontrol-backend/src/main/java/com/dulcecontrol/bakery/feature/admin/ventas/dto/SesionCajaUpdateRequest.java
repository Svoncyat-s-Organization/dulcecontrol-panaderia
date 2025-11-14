package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDateTime;

public record SesionCajaUpdateRequest(
        @NotNull Long cajaId,
        @PositiveOrZero Long montoInicialCentimos,
        Long montoFinalEsperadoCentimos,
        Long montoFinalRealCentimos,
        LocalDateTime fechaApertura,
        LocalDateTime fechaCierre,
        Boolean estaAbierta,
        Long usuarioCierreId
) {
}

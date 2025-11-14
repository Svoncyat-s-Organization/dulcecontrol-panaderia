package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

public record PersonalizacionItemUpdateRequest(
        @NotBlank String descripcionSolicitud,
        String textoDedicatoria,
        List<@Size(max = 2048) String> imagenesReferencia,
        @Size(max = 100) String saborMasa,
        @Size(max = 100) String saborRelleno,
        @Size(max = 100) String tematica,
        LocalDateTime fechaLimiteProduccion,
        @PositiveOrZero Long costoExtraPersonalizacionCentimos
) {
}

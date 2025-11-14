package com.dulcecontrol.bakery.features.admin.ventas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CajaUpdateRequest(
        @NotNull Long sedeId,
        @NotBlank @Size(max = 100) String nombre,
        Boolean activa
) {
}

package com.dulcecontrol.bakery.feature.admin.ventas.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CajaCreateRequest(
        @NotNull Long sedeId,
        @NotBlank @Size(max = 100) String nombre,
        Boolean activa
) {
}

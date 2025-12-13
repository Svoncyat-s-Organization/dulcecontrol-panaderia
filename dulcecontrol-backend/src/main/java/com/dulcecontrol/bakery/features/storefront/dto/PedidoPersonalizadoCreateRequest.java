package com.dulcecontrol.bakery.features.storefront.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PedidoPersonalizadoCreateRequest(
        @NotNull Long tiendaId,
        @NotNull Long productoId,
        @NotNull @Min(1) Integer cantidad,
        @NotBlank @Size(max = 1000) String descripcionSolicitud,
        @Size(max = 500) String textoDedicatoria,
        @Size(max = 100) String saborMasa,
        @Size(max = 100) String saborRelleno,
        @Size(max = 100) String tematica
) {
}

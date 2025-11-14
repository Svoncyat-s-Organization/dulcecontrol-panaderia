package com.dulcecontrol.bakery.features.admin.inventario.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioProductoUpdateRequest {

    @NotNull(message = "La sede es requerida")
    private Long sedeId;

    @NotNull(message = "El producto es requerido")
    private Long productoId;

    @NotNull(message = "La cantidad actual es requerida")
    @Min(value = 0, message = "La cantidad debe ser mayor o igual a 0")
    private Integer cantidadActual;

    private String ubicacionFisica;
}

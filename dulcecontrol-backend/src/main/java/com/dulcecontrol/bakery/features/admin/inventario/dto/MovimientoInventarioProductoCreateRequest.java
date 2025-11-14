package com.dulcecontrol.bakery.features.admin.inventario.dto;

import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
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
public class MovimientoInventarioProductoCreateRequest {

    @NotNull(message = "La sede es requerida")
    private Long sedeId;

    @NotNull(message = "El producto es requerido")
    private Long productoId;

    @NotNull(message = "El tipo de movimiento es requerido")
    private TipoMovimientoInsumo tipoMovimiento;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private Long pedidoId;
    private Long planProduccionId;

    @NotNull(message = "El motivo es requerido")
    private MotivoMovimientoProducto motivo;

    private Long responsableId;
}

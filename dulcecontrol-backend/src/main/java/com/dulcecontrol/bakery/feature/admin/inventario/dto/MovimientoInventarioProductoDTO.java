package com.dulcecontrol.bakery.feature.admin.inventario.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioProductoDTO {
    private Long id;

    @NotNull(message = "La sede es requerida")
    private Long sedeId;

    @NotNull(message = "El producto es requerido")
    private Long productoId;

    @NotNull(message = "El tipo de movimiento es requerido")
    private TipoMovimientoInsumo tipoMovimiento;

    @NotNull(message = "La cantidad es requerida")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private Integer cantidadAnterior;
    private Integer cantidadPosterior;
    private Long pedidoId;
    private Long planProduccionId;

    @NotNull(message = "El motivo es requerido")
    private MotivoMovimientoProducto motivo;

    private Long responsableId;
    private LocalDateTime creadoEn;
}

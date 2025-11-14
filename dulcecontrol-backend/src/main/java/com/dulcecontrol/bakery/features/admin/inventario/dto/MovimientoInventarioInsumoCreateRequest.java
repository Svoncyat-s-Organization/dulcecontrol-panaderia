package com.dulcecontrol.bakery.features.admin.inventario.dto;

import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioInsumoCreateRequest {

    @NotNull(message = "La sede es requerida")
    private Long sedeId;

    @NotNull(message = "El insumo es requerido")
    private Long insumoId;

    @NotNull(message = "El tipo de movimiento es requerido")
    private TipoMovimientoInsumo tipoMovimiento;

    @NotNull(message = "La cantidad es requerida")
    @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a 0")
    private BigDecimal cantidad;

    private Long ordenCompraId;
    private Long planProduccionId;
    private Long transferenciaId;
    private String motivo;
    private Long responsableId;
}

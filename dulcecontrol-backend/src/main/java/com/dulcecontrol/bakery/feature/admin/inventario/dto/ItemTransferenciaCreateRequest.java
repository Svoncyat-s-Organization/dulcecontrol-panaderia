package com.dulcecontrol.bakery.feature.admin.inventario.dto;

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
public class ItemTransferenciaCreateRequest {
    private Long insumoId;
    private Long productoId;

    @NotNull(message = "La cantidad enviada es requerida")
    @DecimalMin(value = "0.01", message = "La cantidad enviada debe ser mayor a 0")
    private BigDecimal cantidadEnviada;
}

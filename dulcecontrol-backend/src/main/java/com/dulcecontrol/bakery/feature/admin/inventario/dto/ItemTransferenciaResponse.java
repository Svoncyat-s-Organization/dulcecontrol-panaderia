package com.dulcecontrol.bakery.feature.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemTransferenciaResponse {
    private Long id;
    private Long transferenciaId;
    private Long insumoId;
    private Long productoId;
    private BigDecimal cantidadEnviada;
    private BigDecimal cantidadRecibida;
}

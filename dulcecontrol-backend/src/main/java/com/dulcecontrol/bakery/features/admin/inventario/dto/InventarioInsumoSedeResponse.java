package com.dulcecontrol.bakery.features.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioInsumoSedeResponse {
    private Long id;
    private Long sedeId;
    private Long insumoId;
    private BigDecimal cantidadActual;
    private String ubicacionFisica;
    private LocalDateTime actualizadoEn;
}

package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InventarioInsumoSedeDTO {
    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private Long insumoId;
    private BigDecimal cantidadActual;
    private String ubicacionFisica;
}

package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemTransferenciaDTO {
    private Long id;
    private Long transferenciaId;
    private Long insumoId;
    private Long productoId;
    private BigDecimal cantidadEnviada;
    private BigDecimal cantidadRecibida;
}

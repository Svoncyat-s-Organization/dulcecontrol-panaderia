package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaVendidaResponse {
    private String tipo;
    private BigDecimal ventas;
    private Integer pedidos;
}

package com.dulcecontrol.bakery.features.superadmin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacturacionMensualResponse {
    private String mes;
    private BigDecimal total;
}

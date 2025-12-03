package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoBajoStockResponse {
    private String sku;
    private String nombre;
    private Integer stock;
    private String ubicacion;
}

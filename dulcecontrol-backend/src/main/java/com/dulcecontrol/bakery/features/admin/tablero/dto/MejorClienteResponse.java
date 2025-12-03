package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MejorClienteResponse {
    private String nombre;
    private Integer compras;
    private String ticket;
}

package com.dulcecontrol.bakery.features.admin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoRecienteResponse {
    private String id;
    private String cliente;
    private String total;
    private String estado;
}

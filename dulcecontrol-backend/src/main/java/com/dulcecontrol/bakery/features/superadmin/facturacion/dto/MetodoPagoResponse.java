package com.dulcecontrol.bakery.features.superadmin.facturacion.dto;

import lombok.Data;

@Data
public class MetodoPagoResponse {
    private Long id;
    private String nombre;
    private String codigo;
    private Boolean activo;
}

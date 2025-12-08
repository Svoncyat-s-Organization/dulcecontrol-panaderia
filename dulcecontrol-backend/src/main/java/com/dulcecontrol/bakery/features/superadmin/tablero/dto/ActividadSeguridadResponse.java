package com.dulcecontrol.bakery.features.superadmin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActividadSeguridadResponse {
    private String fecha;
    private String evento;
    private String detalle;
    private String impacto;
}

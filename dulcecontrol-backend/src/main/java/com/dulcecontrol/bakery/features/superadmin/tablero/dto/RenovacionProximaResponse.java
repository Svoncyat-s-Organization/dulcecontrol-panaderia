package com.dulcecontrol.bakery.features.superadmin.tablero.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RenovacionProximaResponse {
    private String tienda;
    private String plan;
    private String fechaRenovacion;
    private Integer diasRestantes;
    private String estado;
}

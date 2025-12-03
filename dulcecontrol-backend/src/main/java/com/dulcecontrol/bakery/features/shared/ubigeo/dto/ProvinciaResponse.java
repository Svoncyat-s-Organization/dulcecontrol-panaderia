package com.dulcecontrol.bakery.features.shared.ubigeo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProvinciaResponse {
    private Long id;
    private Long departamentoId;
    private String nombre;
    private String codigoUbigeo;
}

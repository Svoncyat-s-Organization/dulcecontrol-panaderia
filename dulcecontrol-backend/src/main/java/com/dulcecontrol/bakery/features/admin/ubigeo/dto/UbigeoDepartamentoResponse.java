package com.dulcecontrol.bakery.features.admin.ubigeo.dto;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoDepartamento;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UbigeoDepartamentoResponse {

    private final Long id;
    private final String nombre;
    private final String codigoUbigeo;

    public static UbigeoDepartamentoResponse fromEntity(UbigeoDepartamento entity) {
        return UbigeoDepartamentoResponse.builder()
                .id(entity.getId())
                .nombre(entity.getNombre())
                .codigoUbigeo(entity.getCodigoUbigeo())
                .build();
    }
}

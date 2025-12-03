package com.dulcecontrol.bakery.features.admin.ubigeo.dto;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoProvincia;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UbigeoProvinciaResponse {

    private final Long id;
    private final Long departamentoId;
    private final String nombre;
    private final String codigoUbigeo;

    public static UbigeoProvinciaResponse fromEntity(UbigeoProvincia entity) {
        return UbigeoProvinciaResponse.builder()
                .id(entity.getId())
                .departamentoId(entity.getDepartamentoId())
                .nombre(entity.getNombre())
                .codigoUbigeo(entity.getCodigoUbigeo())
                .build();
    }
}

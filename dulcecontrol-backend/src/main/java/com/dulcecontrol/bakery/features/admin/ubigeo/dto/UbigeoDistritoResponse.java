package com.dulcecontrol.bakery.features.admin.ubigeo.dto;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoDistrito;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UbigeoDistritoResponse {

    private final Long id;
    private final Long provinciaId;
    private final String nombre;
    private final String codigoUbigeo;

    public static UbigeoDistritoResponse fromEntity(UbigeoDistrito entity) {
        return UbigeoDistritoResponse.builder()
                .id(entity.getId())
                .provinciaId(entity.getProvinciaId())
                .nombre(entity.getNombre())
                .codigoUbigeo(entity.getCodigoUbigeo())
                .build();
    }
}

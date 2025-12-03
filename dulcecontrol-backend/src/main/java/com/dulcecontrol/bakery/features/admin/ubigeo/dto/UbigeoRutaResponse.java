package com.dulcecontrol.bakery.features.admin.ubigeo.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UbigeoRutaResponse {

    private final UbigeoDepartamentoResponse departamento;
    private final UbigeoProvinciaResponse provincia;
    private final UbigeoDistritoResponse distrito;
}

package com.dulcecontrol.bakery.features.admin.produccion.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StockIdealResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long sedeId;
    private final Long productoId;
    private final Integer cantidadIdeal;
    private final Integer puntoReposicion;
    private final LocalDateTime actualizadoEn;
}

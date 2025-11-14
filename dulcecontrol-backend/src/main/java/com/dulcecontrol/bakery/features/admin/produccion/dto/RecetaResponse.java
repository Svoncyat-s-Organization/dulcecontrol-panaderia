package com.dulcecontrol.bakery.features.admin.produccion.dto;

import com.dulcecontrol.bakery.features.admin.produccion.entity.enums.UnidadMedidaReceta;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecetaResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long productoId;
    private final Long insumoId;
    private final BigDecimal cantidadRequerida;
    private final UnidadMedidaReceta unidadMedida;
    private final String notasPreparacion;
    private final LocalDateTime creadoEn;
}

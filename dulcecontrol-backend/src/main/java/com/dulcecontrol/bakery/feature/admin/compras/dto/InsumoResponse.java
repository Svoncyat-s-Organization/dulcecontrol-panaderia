package com.dulcecontrol.bakery.feature.admin.compras.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.UnidadMedida;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class InsumoResponse {

    private final Long id;
    private final Long tiendaId;
    private final String nombre;
    private final String codigoInterno;
    private final UnidadMedida unidadBase;
    private final UnidadMedida unidadCompraHabitual;
    private final BigDecimal factorConversion;
    private final Long costoPromedioUnitarioCentimos;
    private final Long ultimoPrecioCompraCentimos;
    private final BigDecimal stockActualGlobal;
    private final BigDecimal stockMinimoGlobal;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
}

package com.dulcecontrol.bakery.feature.admin.compras.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.UnidadMedida;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class DetalleOrdenCompraResponse {

    private final Long id;
    private final Long ordenCompraId;
    private final Long insumoId;
    private final BigDecimal cantidadSolicitada;
    private final UnidadMedida unidadCompra;
    private final Long costoUnitarioPactadoCentimos;
    private final Long totalLineaCentimos;
    private final BigDecimal cantidadRecibida;
    private final Boolean recibidoCompleto;
}

package com.dulcecontrol.bakery.features.superadmin.facturacion.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DetalleComprobanteResponse {
    private final Long id;
    private final Long comprobanteId;
    private final String descripcion;
    private final Integer cantidad;
    private final Long valorUnitarioCentimos;
    private final Long precioUnitarioCentimos;
    private final Long igvItemCentimos;
    private final Long totalItemCentimos;
}
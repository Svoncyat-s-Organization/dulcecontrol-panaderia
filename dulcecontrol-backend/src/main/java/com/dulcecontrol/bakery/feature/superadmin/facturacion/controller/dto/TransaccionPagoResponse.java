package com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoTransaccion;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class TransaccionPagoResponse {
    private final Long id;
    private final Long comprobanteId;
    private final String pasarela;
    private final String idTransaccionPasarela;
    private final Long montoCentimos;
    private final String moneda;
    private final EstadoTransaccion estado;
    private final String codigoError;
    private final String mensajeError;
    private final Map<String, Object> metadataPasarela;
    private final LocalDateTime creadoEn;
}
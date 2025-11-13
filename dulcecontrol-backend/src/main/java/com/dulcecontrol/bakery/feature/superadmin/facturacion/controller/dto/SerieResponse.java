package com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class SerieResponse {
    private final Integer id;
    private final TipoComprobante tiposComprobante;
    private final String serie;
    private final Integer ultimoCorrelativo;
    private final Boolean activo;
    private final Boolean esPredeterminada;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}
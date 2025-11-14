package com.dulcecontrol.bakery.features.admin.facturacion.dto;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TiendaSerieResponse {

    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private TipoComprobante tipoComprobante;
    private String serie;
    private Integer correlativoActual;
    private Boolean esElectronica;
    private Boolean activa;
    private LocalDateTime creadoEn;
}

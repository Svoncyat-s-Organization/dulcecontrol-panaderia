package com.dulcecontrol.bakery.features.superadmin.facturacion.dto;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.TipoDocumento;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoPago;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.TipoComprobante;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class ComprobanteResponse {
    private final Long id;
    private final Long tiendaId;
    private final Integer serieId;
    private final TipoComprobante tiposComprobante;
    private final Integer correlativo;
    private final EstadoPago estadoPago;
    private final EstadoSunat estadosSunat;
    private final LocalDateTime fechaEmision;
    private final TipoDocumento clienteTipoDoc;
    private final String clienteNumDoc;
    private final String clienteNombreDoc;
    private final String clienteDireccion;
    private final String moneda;
    private final Long totalGravadoCentimos;
    private final Long totalIgvCentimos;
    private final Long totalImporteCentimos;
    private final String urlXml;
    private final String urlCdr;
    private final String urlPdf;
    private final LocalDateTime creadoEn;
}
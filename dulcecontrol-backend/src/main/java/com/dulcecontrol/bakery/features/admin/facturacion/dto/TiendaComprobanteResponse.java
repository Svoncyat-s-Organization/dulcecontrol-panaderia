package com.dulcecontrol.bakery.features.admin.facturacion.dto;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoDocumentoCliente;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TiendaComprobanteResponse {

    private Long id;
    private Long tiendaId;
    private Long pedidoId;
    private Long serieId;

    private String emisorRazonSocial;
    private String emisorRuc;
    private String emisorDireccion;

    private TipoDocumentoCliente clienteTipoDoc;
    private String clienteNumeroDoc;
    private String clienteNombre;
    private String clienteDireccion;

    private TipoComprobante tipoComprobante;
    private Integer correlativo;
    private LocalDateTime fechaEmision;
    private String moneda;

    private Long totalGravadoCentimos;
    private Long totalInafectoCentimos;
    private Long totalExoneradoCentimos;
    private Long totalIgvCentimos;
    private Long totalImpuestosBolsaCentimos;
    private Long totalImporteCentimos;

    private EstadoSunat estadoSunat;

    private String codigoHashCpe;
    private String xmlFirmadoUrl;
    private String cdrSunatUrl;
    private String representacionImpresaUrl;

    private String respuestaSunatCodigo;
    private String respuestaSunatDescripcion;

    private LocalDateTime creadoEn;
}

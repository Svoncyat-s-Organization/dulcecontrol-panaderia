package com.dulcecontrol.bakery.features.admin.facturacion.entity;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.converter.EstadoSunatConverter;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.converter.TipoComprobanteConverter;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.converter.TipoDocumentoClienteConverter;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoDocumentoCliente;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "tienda_comprobantes")
@Data
public class TiendaComprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "serie_id", nullable = false)
    private Long serieId;

    @Column(name = "emisor_razon_social", nullable = false)
    private String emisorRazonSocial;

    @Column(name = "emisor_ruc", nullable = false, length = 20)
    private String emisorRuc;

    @Column(name = "emisor_direccion", nullable = false, columnDefinition = "TEXT")
    private String emisorDireccion;

    @Convert(converter = TipoDocumentoClienteConverter.class)
    @Column(name = "cliente_tipo_doc", nullable = false, columnDefinition = "ENUM('DNI', 'RUC')")
    private TipoDocumentoCliente clienteTipoDoc;

    @Column(name = "cliente_numero_doc", nullable = false, length = 20)
    private String clienteNumeroDoc;

    @Column(name = "cliente_nombre", nullable = false)
    private String clienteNombre;

    @Column(name = "cliente_direccion", columnDefinition = "TEXT")
    private String clienteDireccion;

    @Convert(converter = TipoComprobanteConverter.class)
    @Column(name = "tipo_comprobante", nullable = false, columnDefinition = "ENUM('factura', 'boleta', 'nota_credito', 'nota_debito')")
    private TipoComprobante tipoComprobante;

    @Column(nullable = false)
    private Integer correlativo;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(length = 3)
    private String moneda = "PEN";

    @Column(name = "total_gravado_centimos")
    private Long totalGravadoCentimos = 0L;

    @Column(name = "total_inafecto_centimos")
    private Long totalInafectoCentimos = 0L;

    @Column(name = "total_exonerado_centimos")
    private Long totalExoneradoCentimos = 0L;

    @Column(name = "total_igv_centimos")
    private Long totalIgvCentimos = 0L;

    @Column(name = "total_impuestos_bolsa_centimos")
    private Long totalImpuestosBolsaCentimos = 0L;

    @Column(name = "total_importe_centimos", nullable = false)
    private Long totalImporteCentimos;

    @Convert(converter = EstadoSunatConverter.class)
    @Column(name = "estado_sunat", nullable = false, columnDefinition = "ENUM('pendiente', 'enviado', 'aceptado', 'observado', 'rechazado', 'anulado')")
    private EstadoSunat estadoSunat = EstadoSunat.PENDIENTE;

    @Column(name = "codigo_hash_cpe")
    private String codigoHashCpe;

    @Column(name = "xml_firmado_url", columnDefinition = "TEXT")
    private String xmlFirmadoUrl;

    @Column(name = "cdr_sunat_url", columnDefinition = "TEXT")
    private String cdrSunatUrl;

    @Column(name = "representacion_impresa_url", columnDefinition = "TEXT")
    private String representacionImpresaUrl;

    @Column(name = "respuesta_sunat_codigo", length = 50)
    private String respuestaSunatCodigo;

    @Column(name = "respuesta_sunat_descripcion", columnDefinition = "TEXT")
    private String respuestaSunatDescripcion;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (fechaEmision == null) {
            fechaEmision = LocalDateTime.now();
        }
        if (moneda == null) {
            moneda = "PEN";
        }
        if (estadoSunat == null) {
            estadoSunat = EstadoSunat.PENDIENTE;
        }
        if (totalGravadoCentimos == null) {
            totalGravadoCentimos = 0L;
        }
        if (totalInafectoCentimos == null) {
            totalInafectoCentimos = 0L;
        }
        if (totalExoneradoCentimos == null) {
            totalExoneradoCentimos = 0L;
        }
        if (totalIgvCentimos == null) {
            totalIgvCentimos = 0L;
        }
        if (totalImpuestosBolsaCentimos == null) {
            totalImpuestosBolsaCentimos = 0L;
        }
    }
}

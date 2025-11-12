package com.dulcecontrol.bakery.feature.superadmin.facturacion.entity;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.TipoDocumento;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoPago;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "comprobantes")
@Data
public class Comprobante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "referencia_id")
    private Long referenciaId;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "suscripcion_id")
    private Long suscripcionId;

    @Column(name = "serie_id", nullable = false)
    private Integer serieId;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_pago", nullable = false, columnDefinition = "ENUM('borrador','pendiente','pagado','anulado','reembolsado')")
    private EstadoPago estadoPago = EstadoPago.pendiente;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipos_comprobante", nullable = false, columnDefinition = "ENUM('factura','boleta','nota_credito','nota_debito')")
    private TipoComprobante tiposComprobante;

    @Column(nullable = false)
    private Integer correlativo;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "cliente_tipo_doc", nullable = false, columnDefinition = "ENUM('DNI','RUC')")
    private TipoDocumento clienteTipoDoc;

    @Column(name = "cliente_num_doc", nullable = false, length = 20)
    private String clienteNumDoc;

    @Column(name = "cliente_nombre_doc", nullable = false, length = 255)
    private String clienteNombreDoc;

    @Column(name = "cliente_direccion")
    private String clienteDireccion;

    @Column(name = "moneda", columnDefinition = "CHAR(3)", nullable = false)
    private String moneda = "PEN";

    @Column(name = "total_gravado_centimos", nullable = false)
    private Long totalGravadoCentimos = 0L;

    @Column(name = "total_igv_centimos", nullable = false)
    private Long totalIgvCentimos = 0L;

    @Column(name = "total_importe_centimos", nullable = false)
    private Long totalImporteCentimos;

    @Enumerated(EnumType.STRING)
    @Column(name = "estados_sunat", nullable = false, columnDefinition = "ENUM('pendiente','enviado','aceptado','observado','rechazado','anulado')")
    private EstadoSunat estadosSunat = EstadoSunat.pendiente;

    @Column(name = "codigo_error_sunat", length = 50)
    private String codigoErrorSunat;

    @Column(name = "respuesta_sunat")
    private String respuestaSunat;

    @Column(name = "url_xml")
    private String urlXml;

    @Column(name = "url_cdr")
    private String urlCdr;

    @Column(name = "url_pdf")
    private String urlPdf;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (moneda == null) moneda = "PEN";
        if (estadoPago == null) estadoPago = EstadoPago.pendiente;
        if (estadosSunat == null) estadosSunat = EstadoSunat.pendiente;
        if (totalGravadoCentimos == null) totalGravadoCentimos = 0L;
        if (totalIgvCentimos == null) totalIgvCentimos = 0L;
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
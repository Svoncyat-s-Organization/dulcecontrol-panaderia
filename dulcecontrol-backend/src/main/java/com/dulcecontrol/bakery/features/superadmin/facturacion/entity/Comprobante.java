package com.dulcecontrol.bakery.features.superadmin.facturacion.entity;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.TipoDocumento;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoPago;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.TipoComprobante;
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
    @Column(name = "estado_pago", nullable = false)
    private EstadoPago estadoPago;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipos_comprobante", nullable = false)
    private TipoComprobante tiposComprobante;

    @Column(nullable = false)
    private Integer correlativo;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Enumerated(EnumType.STRING)
    @Column(name = "cliente_tipo_doc", nullable = false)
    private TipoDocumento clienteTipoDoc;

    @Column(name = "cliente_num_doc", nullable = false)
    private String clienteNumDoc;

    @Column(name = "cliente_nombre_doc", nullable = false)
    private String clienteNombreDoc;

    @Column(name = "cliente_direccion")
    private String clienteDireccion;

    @Column(nullable = false)
    private String moneda = "PEN";

    @Column(name = "total_gravado_centimos", nullable = false)
    private Long totalGravadoCentimos;

    @Column(name = "total_igv_centimos", nullable = false)
    private Long totalIgvCentimos;

    @Column(name = "total_importe_centimos", nullable = false)
    private Long totalImporteCentimos;

    @Enumerated(EnumType.STRING)
    @Column(name = "estados_sunat", nullable = false)
    private EstadoSunat estadosSunat;

    @Column(name = "codigo_error_sunat")
    private String codigoErrorSunat;

    @Column(name = "respuesta_sunat")
    private String respuestaSunat;

    @Column(name = "url_xml")
    private String urlXml;

    @Column(name = "url_cdr")
    private String urlCdr;

    @Column(name = "url_pdf")
    private String urlPdf;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en", nullable = false)
    private LocalDateTime actualizadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

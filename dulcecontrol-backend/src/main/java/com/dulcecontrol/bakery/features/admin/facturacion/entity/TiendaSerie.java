package com.dulcecontrol.bakery.features.admin.facturacion.entity;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.converter.TipoComprobanteConverter;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "tienda_series")
@Data
public class TiendaSerie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Convert(converter = TipoComprobanteConverter.class)
    @Column(name = "tipo_comprobante", nullable = false, columnDefinition = "ENUM('factura', 'boleta', 'nota_credito', 'nota_debito')")
    private TipoComprobante tipoComprobante;

    @Column(nullable = false, length = 4)
    private String serie;

    @Column(name = "correlativo_actual", nullable = false)
    private Integer correlativoActual = 0;

    @Column(name = "es_electronica")
    private Boolean esElectronica = Boolean.TRUE;

    @Column(nullable = false)
    private Boolean activa = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (correlativoActual == null) {
            correlativoActual = 0;
        }
        if (esElectronica == null) {
            esElectronica = Boolean.TRUE;
        }
        if (activa == null) {
            activa = Boolean.TRUE;
        }
    }
}

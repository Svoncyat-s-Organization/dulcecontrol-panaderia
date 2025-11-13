package com.dulcecontrol.bakery.feature.superadmin.facturacion.entity;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "series")
@Data
public class Serie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipos_comprobante", nullable = false, columnDefinition = "ENUM('factura','boleta','nota_credito','nota_debito')")
    private TipoComprobante tiposComprobante;

    @Column(name = "serie", columnDefinition = "CHAR(4)", nullable = false, unique = true)
    private String serie;

    @Column(name = "ultimo_correlativo", nullable = false)
    private Integer ultimoCorrelativo = 0;

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "es_predeterminada", nullable = false)
    private Boolean esPredeterminada = Boolean.FALSE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (activo == null) activo = Boolean.TRUE;
        if (esPredeterminada == null) esPredeterminada = Boolean.FALSE;
        if (ultimoCorrelativo == null) ultimoCorrelativo = 0;
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
package com.dulcecontrol.bakery.features.admin.compras.entity;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoComprobanteProveedor;
import com.dulcecontrol.bakery.features.admin.compras.entity.converter.EstadoOrdenCompraConverter;
import com.dulcecontrol.bakery.features.admin.compras.entity.converter.MetodoPagoConverter;
import com.dulcecontrol.bakery.features.admin.compras.entity.converter.TipoComprobanteProveedorConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes_compra")
@Data
public class OrdenCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_destino_id", nullable = false)
    private Long sedeDestinoId;

    @Column(name = "proveedor_id", nullable = false)
    private Long proveedorId;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision;

    @Column(name = "fecha_recepcion_esperada")
    private LocalDate fechaRecepcionEsperada;

    @Column(name = "fecha_recepcion_real")
    private LocalDate fechaRecepcionReal;

    @Convert(converter = EstadoOrdenCompraConverter.class)
    @Column(nullable = false, columnDefinition = "ENUM('borrador', 'enviada', 'recibida_parcial', 'recibida_total', 'cancelada')")
    private EstadoOrdenCompra estado = EstadoOrdenCompra.BORRADOR;

    @Column(length = 3)
    private String moneda = "PEN";

    @Column(name = "total_compra_centimos", nullable = false)
    private Long totalCompraCentimos = 0L;

    @Convert(converter = MetodoPagoConverter.class)
    @Column(name = "metodo_pago", columnDefinition = "ENUM('efectivo', 'credito')")
    private MetodoPago metodoPago;

    @Column(name = "monto_inicial_centimos")
    private Long montoInicialCentimos = 0L;

    @Column(name = "monto_pagado_centimos")
    private Long montoPagadoCentimos = 0L;

    @Column(name = "saldo_pendiente_centimos")
    private Long saldoPendienteCentimos = 0L;

    @Column(name = "referencia_pago", length = 100)
    private String referenciaPago;

    @Convert(converter = TipoComprobanteProveedorConverter.class)
    @Column(name = "tipo_comprobante_proveedor", columnDefinition = "ENUM('factura', 'boleta', 'nota_credito', 'nota_debito')")
    private TipoComprobanteProveedor tipoComprobanteProveedor;

    @Column(name = "serie_comprobante_proveedor", length = 50)
    private String serieComprobanteProveedor;

    @Column(name = "numero_comprobante_proveedor", length = 50)
    private String numeroComprobanteProveedor;

    @Column(name = "url_foto_comprobante", columnDefinition = "TEXT")
    private String urlFotoComprobante;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "registrado_por")
    private Long registradoPor;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (fechaEmision == null) {
            fechaEmision = LocalDate.now();
        }
        if (estado == null) {
            estado = EstadoOrdenCompra.BORRADOR;
        }
        if (moneda == null) {
            moneda = "PEN";
        }
        if (totalCompraCentimos == null) {
            totalCompraCentimos = 0L;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

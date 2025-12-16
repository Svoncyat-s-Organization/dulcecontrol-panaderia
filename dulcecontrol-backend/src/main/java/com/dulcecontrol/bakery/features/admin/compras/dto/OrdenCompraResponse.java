package com.dulcecontrol.bakery.features.admin.compras.dto;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoComprobanteProveedor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrdenCompraResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long sedeDestinoId;
    private final String nombreSede;
    private final Long proveedorId;
    private final String nombreProveedor;
    private final LocalDate fechaEmision;
    private final LocalDate fechaRecepcionEsperada;
    private final LocalDate fechaRecepcionReal;
    private final EstadoOrdenCompra estado;
    private final String moneda;
    private final Long totalCompraCentimos;
    private final MetodoPago metodoPago;
    private final Long montoInicialCentimos;
    private final Long montoPagadoCentimos;
    private final Long saldoPendienteCentimos;
    private final String referenciaPago;
    private final TipoComprobanteProveedor tipoComprobanteProveedor;
    private final String serieComprobanteProveedor;
    private final String numeroComprobanteProveedor;
    private final String urlFotoComprobante;
    private final String observaciones;
    private final Long registradoPor;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
    private final List<DetalleOrdenCompraResponse> detalles;
}

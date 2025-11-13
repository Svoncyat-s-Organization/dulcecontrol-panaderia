package com.dulcecontrol.bakery.feature.admin.compras.controller.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.TipoComprobanteProveedor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrdenCompraCreateRequest {

    @NotNull
    private Long tiendaId;

    @NotNull
    private Long sedeDestinoId;

    @NotNull
    private Long proveedorId;

    private LocalDate fechaEmision = LocalDate.now();

    private LocalDate fechaRecepcionEsperada;

    private EstadoOrdenCompra estado = EstadoOrdenCompra.BORRADOR;

    private String moneda = "PEN";

    private MetodoPago metodoPago;

    private String referenciaPago;

    private TipoComprobanteProveedor tipoComprobanteProveedor;

    private String serieComprobanteProveedor;

    private String numeroComprobanteProveedor;

    private String urlFotoComprobante;

    private String observaciones;

    private Long registradoPor;

    @NotEmpty
    @Valid
    private List<DetalleOrdenCompraRequest> detalles;
}

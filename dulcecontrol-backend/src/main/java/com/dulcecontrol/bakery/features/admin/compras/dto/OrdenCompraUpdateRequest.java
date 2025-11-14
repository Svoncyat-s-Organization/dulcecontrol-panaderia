package com.dulcecontrol.bakery.features.admin.compras.dto;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.TipoComprobanteProveedor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class OrdenCompraUpdateRequest {

    @NotNull
    private Long sedeDestinoId;

    @NotNull
    private Long proveedorId;

    private LocalDate fechaEmision;

    private LocalDate fechaRecepcionEsperada;

    private LocalDate fechaRecepcionReal;

    private EstadoOrdenCompra estado;

    private String moneda;

    private MetodoPago metodoPago;

    private String referenciaPago;

    private TipoComprobanteProveedor tipoComprobanteProveedor;

    private String serieComprobanteProveedor;

    private String numeroComprobanteProveedor;

    private String urlFotoComprobante;

    private String observaciones;

    @Valid
    private List<DetalleOrdenCompraRequest> detalles;
}

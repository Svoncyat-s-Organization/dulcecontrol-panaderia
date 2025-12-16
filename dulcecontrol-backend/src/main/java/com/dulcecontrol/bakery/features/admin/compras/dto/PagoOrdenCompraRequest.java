package com.dulcecontrol.bakery.features.admin.compras.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class PagoOrdenCompraRequest {

    @NotNull
    private Long ordenCompraId;

    private LocalDate fechaPago = LocalDate.now();

    @NotNull
    private Long montoPagadoCentimos;

    private String metodoPago;

    private String referenciaPago;

    private String urlFotoComprobante;

    private String observaciones;
}

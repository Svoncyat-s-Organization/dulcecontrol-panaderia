package com.dulcecontrol.bakery.features.admin.compras.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoOrdenCompraResponse {

    private Long id;
    private Long ordenCompraId;
    private LocalDate fechaPago;
    private Long montoPagadoCentimos;
    private String metodoPago;
    private String referenciaPago;
    private String urlFotoComprobante;
    private String observaciones;
    private LocalDateTime creadoEn;
    private LocalDateTime actualizadoEn;
}

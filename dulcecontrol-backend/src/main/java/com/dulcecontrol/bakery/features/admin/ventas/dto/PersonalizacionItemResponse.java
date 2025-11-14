package com.dulcecontrol.bakery.features.admin.ventas.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class PersonalizacionItemResponse {

    private final Long id;
    private final Long detallePedidoId;
    private final String descripcionSolicitud;
    private final String textoDedicatoria;
    private final List<String> imagenesReferencia;
    private final String saborMasa;
    private final String saborRelleno;
    private final String tematica;
    private final LocalDateTime fechaLimiteProduccion;
    private final Long costoExtraPersonalizacionCentimos;
}

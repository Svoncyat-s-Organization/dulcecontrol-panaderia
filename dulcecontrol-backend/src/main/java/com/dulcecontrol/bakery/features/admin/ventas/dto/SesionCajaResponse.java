package com.dulcecontrol.bakery.features.admin.ventas.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class SesionCajaResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long cajaId;
    private final Long usuarioAperturaId;
    private final Long usuarioCierreId;
    private final Long montoInicialCentimos;
    private final Long montoFinalEsperadoCentimos;
    private final Long montoFinalRealCentimos;
    private final Long diferenciaCentimos;
    private final LocalDateTime fechaApertura;
    private final LocalDateTime fechaCierre;
    private final Boolean estaAbierta;
}

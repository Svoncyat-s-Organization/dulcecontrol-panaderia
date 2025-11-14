package com.dulcecontrol.bakery.feature.admin.ventas.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CajaResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long sedeId;
    private final String nombre;
    private final Boolean activa;
    private final LocalDateTime creadoEn;
}

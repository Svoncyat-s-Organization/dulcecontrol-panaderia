package com.dulcecontrol.bakery.features.admin.catalogo.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CategoriaResponse {

    private final Long id;
    private final Long tiendaId;
    private final String nombre;
    private final String slug;
    private final String descripcion;
    private final String urlImagen;
    private final String icono;
    private final Boolean activa;
    private final Integer ordenVisual;
    private final LocalDateTime creadoEn;
}

package com.dulcecontrol.bakery.features.publico.catalogo.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * DTO para exponer categorías en el storefront público.
 * Solo incluye campos necesarios para la UI del cliente.
 */
@Getter
@Builder
public class CategoriaPublicaResponse {
    private final Long id;
    private final String nombre;
    private final String slug;
    private final String descripcion;
    private final String urlImagen;
    private final String icono;
    private final Integer ordenVisual;
}

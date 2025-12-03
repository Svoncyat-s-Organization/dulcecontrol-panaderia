package com.dulcecontrol.bakery.features.publico.catalogo.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

/**
 * DTO para detalle completo de producto en el storefront.
 * Incluye galería de imágenes y atributos adicionales.
 */
@Getter
@Builder
public class ProductoDetallePublicoResponse {
    private final Long id;
    private final String nombre;
    private final String slug;
    private final String descripcion;
    private final Long precioBaseCentimos;
    private final Long precioOfertaCentimos;
    private final Boolean esPersonalizable;
    private final String urlImagenPrincipal;
    private final List<String> imagenesGaleria;
    private final Map<String, Object> atributos;  // Datos JSONB flexibles
    private final CategoriaPublicaResponse categoria;

    /**
     * Helper para obtener el precio efectivo (oferta o base).
     */
    public Long getPrecioEfectivoCentimos() {
        return precioOfertaCentimos != null ? precioOfertaCentimos : precioBaseCentimos;
    }
    
    /**
     * Indica si el producto tiene oferta activa.
     */
    public Boolean getTieneOferta() {
        return precioOfertaCentimos != null && precioOfertaCentimos < precioBaseCentimos;
    }
}

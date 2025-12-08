package com.dulcecontrol.bakery.features.publico.catalogo.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * DTO para listar productos en el storefront público.
 * Incluye información básica para tarjetas de producto.
 * IMPORTANTE: Los precios están en céntimos (dividir por 100 en el frontend).
 */
@Getter
@Builder
public class ProductoPublicoResponse {
    private final Long id;
    private final String nombre;
    private final String slug;
    private final String descripcion;
    private final Long precioBaseCentimos;
    private final Long precioOfertaCentimos;  // nullable - solo si hay oferta activa
    private final Boolean esPersonalizable;
    private final Boolean destacadoStorefront;
    private final String urlImagenPrincipal;
    private final String nombreCategoria;
    private final String slugCategoria;
    private final Long categoriaId;

    /**
     * Helper para obtener el precio efectivo (oferta o base).
     * El frontend debe dividir por 100 para mostrar decimales.
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

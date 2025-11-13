package com.dulcecontrol.bakery.feature.admin.catalogo.controller.dto;

import com.dulcecontrol.bakery.feature.admin.catalogo.entity.enums.TipoProducto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Builder
public class ProductoResponse {

    private final Long id;
    private final Long tiendaId;
    private final Long categoriaId;
    private final String nombre;
    private final String slug;
    private final String sku;
    private final String descripcion;
    private final TipoProducto tipo;
    private final Boolean esPersonalizable;
    private final Long precioBaseCentimos;
    private final Long precioOfertaCentimos;
    private final Boolean visibleEnPos;
    private final Boolean visibleEnStorefront;
    private final Boolean destacadoStorefront;
    private final String urlImagenPrincipal;
    private final List<String> imagenesGaleria;
    private final Map<String, Object> atributos;
    private final Boolean activo;
    private final LocalDateTime creadoEn;
    private final LocalDateTime actualizadoEn;
}

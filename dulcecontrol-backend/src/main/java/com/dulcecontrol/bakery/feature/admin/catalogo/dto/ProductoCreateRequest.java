package com.dulcecontrol.bakery.feature.admin.catalogo.dto;

import com.dulcecontrol.bakery.feature.admin.catalogo.entity.enums.TipoProducto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ProductoCreateRequest {

    private Long categoriaId;

    @NotBlank
    @Size(max = 255)
    private String nombre;

    @NotBlank
    @Size(max = 255)
    private String slug;

    @NotBlank
    @Size(max = 100)
    private String sku;

    private String descripcion;

    @NotNull
    private TipoProducto tipo;

    private Boolean esPersonalizable;

    @NotNull
    @PositiveOrZero
    private Long precioBaseCentimos;

    @PositiveOrZero
    private Long precioOfertaCentimos;

    private Boolean visibleEnPos;

    private Boolean visibleEnStorefront;

    private Boolean destacadoStorefront;

    private String urlImagenPrincipal;

    private List<String> imagenesGaleria;

    private Map<String, Object> atributos;

    private Boolean activo;
}

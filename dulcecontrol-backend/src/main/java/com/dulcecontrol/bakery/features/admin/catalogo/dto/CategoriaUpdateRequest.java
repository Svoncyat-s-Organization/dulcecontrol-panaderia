package com.dulcecontrol.bakery.features.admin.catalogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoriaUpdateRequest {

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @NotBlank
    @Size(max = 100)
    private String slug;

    private String descripcion;

    private String urlImagen;

    private String icono;

    private Boolean activa;

    @PositiveOrZero
    private Integer ordenVisual;
}

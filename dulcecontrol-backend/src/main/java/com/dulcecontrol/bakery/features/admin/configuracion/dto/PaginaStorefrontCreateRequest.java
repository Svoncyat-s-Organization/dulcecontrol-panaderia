package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginaStorefrontCreateRequest {

    @NotBlank(message = "El slug es obligatorio")
    private String slug;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    private String metaDescripcion;

    @NotNull(message = "El orden en el menú es obligatorio")
    @Min(value = 0, message = "El orden en el menú debe ser mayor o igual a 0")
    private Integer ordenMenu;

    @NotNull(message = "Visible en menú es obligatorio")
    private Boolean visibleEnMenu;

    @NotNull(message = "Activa es obligatoria")
    private Boolean activa;
}
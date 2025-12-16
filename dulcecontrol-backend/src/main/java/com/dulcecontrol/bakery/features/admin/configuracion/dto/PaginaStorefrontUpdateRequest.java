package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import com.dulcecontrol.bakery.features.admin.configuracion.entity.enums.TipoContenido;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaginaStorefrontUpdateRequest {

    @NotBlank(message = "El slug es obligatorio")
    private String slug;

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotBlank(message = "El contenido es obligatorio")
    private String contenido;

    private String metaDescripcion;

    private TipoContenido tipoContenido = TipoContenido.JSON;

    @Min(value = 0, message = "El orden en el menú debe ser mayor o igual a 0")
    private Integer ordenMenu = 0;

    private Boolean visibleEnMenu = false;

    private Boolean activa = true;
}
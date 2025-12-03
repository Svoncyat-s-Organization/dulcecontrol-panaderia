package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para actualizar información de branding (dominios_tienda)
 */
@Data
public class BrandingUpdateRequest {

    @NotBlank(message = "La URL del logo es obligatoria")
    @Size(max = 500, message = "La URL del logo no puede exceder 500 caracteres")
    private String urlLogo;

    @Size(max = 500, message = "La URL del favicon no puede exceder 500 caracteres")
    private String urlFavicon;

    @NotBlank(message = "El color primario es obligatorio")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color primario debe ser un código hexadecimal válido (ej: #FF5733)")
    private String colorPrimario;

    @NotBlank(message = "El color secundario es obligatorio")
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "El color secundario debe ser un código hexadecimal válido (ej: #FF5733)")
    private String colorSecundario;
}

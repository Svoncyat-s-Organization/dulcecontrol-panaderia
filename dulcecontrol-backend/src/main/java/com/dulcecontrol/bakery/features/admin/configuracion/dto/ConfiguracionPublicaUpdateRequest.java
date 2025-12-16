package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para actualizar configuración pública de la tienda
 * (banner, mensaje bienvenida, horarios, redes sociales, políticas)
 */
@Data
public class ConfiguracionPublicaUpdateRequest {

    @Size(max = 50, message = "La primera parte del slogan no puede exceder 50 caracteres")
    private String sloganParte1;

    @Size(max = 50, message = "La segunda parte del slogan no puede exceder 50 caracteres")
    private String sloganParte2;

    @Size(max = 1000, message = "La URL del banner no puede exceder 1000 caracteres")
    private String bannerPrincipalUrl;

    @Size(max = 500, message = "El mensaje de bienvenida no puede exceder 500 caracteres")
    private String mensajeBienvenida;

    private String horarioAtencion; // JSON string

    private String redesSociales; // JSON string
}

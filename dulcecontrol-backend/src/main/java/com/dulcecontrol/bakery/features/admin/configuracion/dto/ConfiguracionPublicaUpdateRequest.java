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

    @Size(max = 100, message = "El slogan no puede exceder 100 caracteres")
    private String sloganTienda;

    @Size(max = 1000, message = "La URL del banner no puede exceder 1000 caracteres")
    private String bannerPrincipalUrl;

    @Size(max = 500, message = "El mensaje de bienvenida no puede exceder 500 caracteres")
    private String mensajeBienvenida;

    private String horarioAtencion; // JSON string

    private String redesSociales; // JSON string
}

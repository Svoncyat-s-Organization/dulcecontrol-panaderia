package com.dulcecontrol.bakery.security.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StorefrontRegisterRequest {

    @NotNull(message = "El ID de la tienda es requerido")
    private Long tiendaId;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String nombreCompleto;

    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es requerido")
    private String email;

    @NotBlank(message = "La contraseña es requerida")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    private String telefono;
}

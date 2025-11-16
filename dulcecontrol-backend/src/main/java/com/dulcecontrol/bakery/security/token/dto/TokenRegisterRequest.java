package com.dulcecontrol.bakery.security.token.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TokenRegisterRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 3, max = 255, message = "El nombre completo debe tener entre 3 y 255 caracteres")
    private String nombreCompleto;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo inválido")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener al menos 8 caracteres")
    private String contrasena;
}

package com.dulcecontrol.bakery.features.admin.configuracion.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SedeCreateRequest {

    @NotBlank(message = "El código interno es obligatorio")
    @Size(max = 50, message = "El código interno no puede exceder 50 caracteres")
    @Pattern(regexp = "^[A-Z0-9-]+$", message = "El código interno solo puede contener letras mayúsculas, números y guiones")
    private String codigoInterno;

    @NotBlank(message = "El nombre de la sede es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @Size(max = 50, message = "El teléfono no puede exceder 50 caracteres")
    @Pattern(regexp = "^[0-9+\\-\\s()]*$", message = "El teléfono solo puede contener números, +, -, espacios y paréntesis")
    private String telefono;

    @NotNull(message = "El distrito es obligatorio")
    private Long distritoId;

    private Boolean esPrincipal;
}

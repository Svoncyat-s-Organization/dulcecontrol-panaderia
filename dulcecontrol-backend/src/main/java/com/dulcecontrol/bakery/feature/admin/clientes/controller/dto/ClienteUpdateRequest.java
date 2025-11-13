package com.dulcecontrol.bakery.feature.admin.clientes.controller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteUpdateRequest {

    @NotBlank(message = "El tipo de documento es obligatorio")
    private String tipoDocumento;

    @NotBlank(message = "El número de documento es obligatorio")
    private String numeroDoc;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombreDoc;

    @Email(message = "El email debe tener un formato válido")
    private String email;

    private String telefono;

    private Boolean esUsuarioVirtual;

    private String hashContrasena;

    private String notas;

    private Boolean activo;
}
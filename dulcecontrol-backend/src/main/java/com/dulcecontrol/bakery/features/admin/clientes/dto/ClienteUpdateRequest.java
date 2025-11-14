package com.dulcecontrol.bakery.features.admin.clientes.dto;

import com.dulcecontrol.bakery.features.admin.clientes.entity.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteUpdateRequest {

    private TipoDocumento tipoDocumento;

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
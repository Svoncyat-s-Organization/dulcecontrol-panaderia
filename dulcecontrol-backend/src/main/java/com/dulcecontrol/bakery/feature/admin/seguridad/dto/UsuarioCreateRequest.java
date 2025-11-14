package com.dulcecontrol.bakery.feature.admin.seguridad.dto;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioCreateRequest {

    @NotNull
    private Long rolId;

    @Email
    @NotBlank
    private String correo;

    @NotBlank
    @Size(min = 8, max = 64)
    private String contrasena;

    @NotNull
    private TipoDocumento tipoDoc;

    @NotBlank
    @Size(max = 20)
    private String numeroDoc;

    @NotBlank
    private String nombres;

    @Size(max = 50)
    private String telefono;
}

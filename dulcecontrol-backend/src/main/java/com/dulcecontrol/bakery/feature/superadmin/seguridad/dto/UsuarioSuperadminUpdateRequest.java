package com.dulcecontrol.bakery.feature.superadmin.seguridad.dto;

import com.dulcecontrol.bakery.feature.superadmin.seguridad.entity.enums.TipoDocumento;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioSuperadminUpdateRequest {

    @Email
    @NotBlank
    private String correo;

    @Size(min = 8, max = 64)
    private String nuevaContrasena;

    @NotNull
    private TipoDocumento tipoDoc;

    @Size(max = 20)
    private String numeroDoc;

    @NotBlank
    private String nombres;

    @Size(max = 50)
    private String telefono;

    private Boolean activo;
}

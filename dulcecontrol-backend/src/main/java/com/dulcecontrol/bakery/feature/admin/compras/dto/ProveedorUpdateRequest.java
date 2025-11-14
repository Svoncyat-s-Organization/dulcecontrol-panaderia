package com.dulcecontrol.bakery.feature.admin.compras.dto;

import com.dulcecontrol.bakery.feature.admin.compras.entity.enums.TipoDocumentoProveedor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProveedorUpdateRequest {

    @NotBlank
    private String nombreComercial;

    @NotNull
    private TipoDocumentoProveedor tipoDoc;

    private String numeroDoc;

    private String razonSocial;

    private String nombreContacto;

    private String telefonoContacto;

    @Email
    private String emailContacto;

    private Boolean esGenerico;

    private Boolean activo;
}

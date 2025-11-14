package com.dulcecontrol.bakery.features.superadmin.tiendas.dto;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.EstadoTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDocumentoTienda;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TiendaCreateRequest {

    @NotBlank
    @Size(max = 100)
    private String slug;

    @NotNull
    private TipoDocumentoTienda tipoDoc;

    @NotBlank
    @Size(max = 20)
    private String numeroDoc;

    @NotBlank
    private String nombreDoc;

    @Size(max = 255)
    private String nombreComercial;

    @NotBlank
    @Email
    private String correoContacto;

    @Size(max = 50)
    private String telefonoContacto;

    @NotBlank
    @Size(min = 8, max = 64)
    private String contrasena;

    private EstadoTienda estado;
}

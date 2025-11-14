package com.dulcecontrol.bakery.feature.superadmin.tiendas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SedeCreateRequest {

    @Size(max = 50)
    private String codigoInterno;

    @NotBlank
    @Size(max = 100)
    private String nombre;

    @NotBlank
    private String direccion;

    @Size(max = 50)
    private String telefono;

    private Long distritoId;

    private Boolean esPrincipal;
}

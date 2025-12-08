package com.dulcecontrol.bakery.features.superadmin.seguridad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class RolSuperadminUpdateRequest {

    @NotBlank
    @Size(max = 120)
    private String nombre;

    @Size(max = 500)
    private String descripcion;

    private Boolean esSistema;

    private Set<String> permisos;
}

package com.dulcecontrol.bakery.features.admin.seguridad.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class RolCreateRequest {

    @NotBlank
    private String nombre;

    private String descripcion;

    private Set<Long> permisos;
}

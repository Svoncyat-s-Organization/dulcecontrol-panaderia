package com.dulcecontrol.bakery.features.admin.clientes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DireccionClienteUpdateRequest {

    private String etiqueta;

    @NotBlank(message = "La dirección completa es obligatoria")
    private String direccionCompleta;

    private String referencia;

    private Long distritoId;

    private String codigoPostal;

    private Boolean esFiscal;

    private Boolean esEntrega;
}
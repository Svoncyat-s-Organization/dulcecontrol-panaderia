package com.dulcecontrol.bakery.features.admin.produccion.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ConteoDiarioCreateRequest {

    @NotNull(message = "sedeId es requerido")
    private Long sedeId;

    @NotNull(message = "fechaConteo es requerida")
    private LocalDate fechaConteo;

    private Long responsableId;

    private String observaciones;

    @NotEmpty(message = "detalles no puede estar vacío")
    @Valid
    private List<DetalleConteoDiarioItem> detalles;
}

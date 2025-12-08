package com.dulcecontrol.bakery.features.admin.produccion.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetalleConteoDiarioItem {

    @NotNull(message = "productoId es requerido")
    private Long productoId;

    @NotNull(message = "cantidadFisica es requerida")
    private Integer cantidadFisica;

    private Integer cantidadSistema;
}

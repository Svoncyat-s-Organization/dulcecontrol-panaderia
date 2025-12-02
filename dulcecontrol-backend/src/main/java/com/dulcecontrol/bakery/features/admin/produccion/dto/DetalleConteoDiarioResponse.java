package com.dulcecontrol.bakery.features.admin.produccion.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DetalleConteoDiarioResponse {

    private Long id;
    private Long productoId;
    private String productoNombre;
    private Integer cantidadFisica;
    private Integer cantidadSistema;
    private Integer diferencia;
}

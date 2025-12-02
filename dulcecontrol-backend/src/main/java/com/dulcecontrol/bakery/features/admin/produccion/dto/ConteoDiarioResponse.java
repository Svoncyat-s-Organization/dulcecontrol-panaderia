package com.dulcecontrol.bakery.features.admin.produccion.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class ConteoDiarioResponse {

    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private LocalDate fechaConteo;
    private Long responsableId;
    private String observaciones;
    private LocalDateTime creadoEn;
    private List<DetalleConteoDiarioResponse> detalles;
}

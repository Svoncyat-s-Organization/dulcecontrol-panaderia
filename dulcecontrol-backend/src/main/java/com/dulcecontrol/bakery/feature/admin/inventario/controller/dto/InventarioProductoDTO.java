package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import lombok.Data;

@Data
public class InventarioProductoDTO {
    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private Long productoId;
    private Integer cantidadActual;
    private String ubicacionFisica;
}

package com.dulcecontrol.bakery.features.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioProductoResponse {
    private Long id;
    private Long sedeId;
    private Long productoId;
    private Integer cantidadActual;
    private String ubicacionFisica;
    private LocalDateTime actualizadoEn;
}

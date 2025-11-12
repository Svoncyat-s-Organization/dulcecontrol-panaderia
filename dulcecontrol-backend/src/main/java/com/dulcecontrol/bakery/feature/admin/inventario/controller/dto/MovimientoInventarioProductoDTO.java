package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimientoInventarioProductoDTO {
    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private Long productoId;
    private String tipoMovimiento;
    private Integer cantidad;
    private Integer cantidadAnterior;
    private Integer cantidadPosterior;
    private Long pedidoId;
    private Long planProduccionId;
    private MotivoMovimientoProducto motivo;
    private Long responsableId;
    private LocalDateTime creadoEn;
}

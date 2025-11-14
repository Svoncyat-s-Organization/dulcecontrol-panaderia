package com.dulcecontrol.bakery.features.admin.inventario.dto;

import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioProductoResponse {
    private Long id;
    private Long sedeId;
    private Long productoId;
    private TipoMovimientoInsumo tipoMovimiento;
    private Integer cantidad;
    private Integer cantidadAnterior;
    private Integer cantidadPosterior;
    private Long pedidoId;
    private Long planProduccionId;
    private MotivoMovimientoProducto motivo;
    private Long responsableId;
    private LocalDateTime creadoEn;
}

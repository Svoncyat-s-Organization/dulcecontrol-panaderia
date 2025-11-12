package com.dulcecontrol.bakery.feature.admin.inventario.controller.dto;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class MovimientoInventarioInsumoDTO {
    private Long id;
    private Long tiendaId;
    private Long sedeId;
    private Long insumoId;
    private TipoMovimientoInsumo tipoMovimiento;
    private BigDecimal cantidad;
    private BigDecimal cantidadAnterior;
    private BigDecimal cantidadPosterior;
    private Long ordenCompraId;
    private Long planProduccionId;
    private Long transferenciaId;
    private String motivo;
    private Long responsableId;
    private LocalDateTime creadoEn;
}

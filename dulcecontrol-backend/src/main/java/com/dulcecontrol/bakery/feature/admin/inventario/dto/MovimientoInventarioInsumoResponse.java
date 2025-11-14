package com.dulcecontrol.bakery.feature.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovimientoInventarioInsumoResponse {
    private Long id;
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

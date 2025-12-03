package com.dulcecontrol.bakery.features.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
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
    
    // Datos enriquecidos del insumo
    private String nombreInsumo;
    private String codigoInterno;
    private String unidadMedida;
    
    // Datos del movimiento
    private TipoMovimientoInsumo tipoMovimiento;
    private BigDecimal cantidad;
    private BigDecimal cantidadAnterior;
    private BigDecimal cantidadPosterior;
    
    // Referencias
    private Long ordenCompraId;
    private Long planProduccionId;
    private Long transferenciaId;
    private String motivo;
    
    // Usuario responsable
    private Long responsableId;
    private String usuarioResponsable;
    
    private LocalDateTime creadoEn;
}

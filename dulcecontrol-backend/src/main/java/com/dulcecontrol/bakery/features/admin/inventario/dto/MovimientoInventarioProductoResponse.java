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
    
    // Datos enriquecidos del producto
    private String nombreProducto;
    private String sku;
    
    // Datos del movimiento
    private TipoMovimientoInsumo tipoMovimiento;
    private Integer cantidad;
    private Integer cantidadAnterior;
    private Integer cantidadPosterior;
    
    // Referencias
    private Long pedidoId;
    private Long planProduccionId;
    private MotivoMovimientoProducto motivo;
    
    // Usuario responsable
    private Long responsableId;
    private String usuarioResponsable;
    
    private LocalDateTime creadoEn;
    
    // Planificación automática generada
    private Boolean planificacionAutomaticaGenerada;
    private Long planGeneradoId;
}

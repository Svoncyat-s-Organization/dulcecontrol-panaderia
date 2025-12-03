package com.dulcecontrol.bakery.features.admin.inventario.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventarioInsumoSedeResponse {
    private Long id;
    private Long sedeId;
    private Long insumoId;
    
    // Datos enriquecidos del insumo
    private String nombreInsumo;
    private String codigoInterno;
    private String unidadMedida;
    private BigDecimal stockMinimo;
    
    // Datos del inventario
    private BigDecimal cantidadActual;
    private String estadoStock;  // OK, BAJO_STOCK, CRITICO, SIN_CONFIGURAR
    private String ubicacionFisica;
    private LocalDateTime actualizadoEn;
}

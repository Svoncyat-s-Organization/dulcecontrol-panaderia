package com.dulcecontrol.bakery.features.admin.compras.entity;

import com.dulcecontrol.bakery.features.admin.compras.entity.enums.UnidadMedida;
import com.dulcecontrol.bakery.features.admin.compras.entity.converter.UnidadMedidaConverter;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "insumos")
@Data
public class Insumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(nullable = false)
    private String nombre;

    @Column(name = "codigo_interno", length = 100)
    private String codigoInterno;

    @Convert(converter = UnidadMedidaConverter.class)
    @Column(name = "unidad_base", nullable = false, columnDefinition = "ENUM('unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'saco', 'lata')")
    private UnidadMedida unidadBase;

    @Convert(converter = UnidadMedidaConverter.class)
    @Column(name = "unidad_compra_habitual", nullable = false, columnDefinition = "ENUM('unidad', 'kg', 'g', 'l', 'ml', 'paquete', 'saco', 'lata')")
    private UnidadMedida unidadCompraHabitual;

    @Column(name = "factor_conversion", precision = 12, scale = 4)
    private BigDecimal factorConversion = BigDecimal.ONE;

    @Column(name = "costo_promedio_unitario_centimos")
    private Long costoPromedioUnitarioCentimos = 0L;

    @Column(name = "ultimo_precio_compra_centimos")
    private Long ultimoPrecioCompraCentimos;

    @Column(name = "stock_actual_global", precision = 12, scale = 4)
    private BigDecimal stockActualGlobal = BigDecimal.ZERO;

    @Column(name = "stock_minimo_global", precision = 12, scale = 4)
    private BigDecimal stockMinimoGlobal = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (activo == null) {
            activo = Boolean.TRUE;
        }
        if (factorConversion == null) {
            factorConversion = BigDecimal.ONE;
        }
        if (costoPromedioUnitarioCentimos == null) {
            costoPromedioUnitarioCentimos = 0L;
        }
        if (stockActualGlobal == null) {
            stockActualGlobal = BigDecimal.ZERO;
        }
        if (stockMinimoGlobal == null) {
            stockMinimoGlobal = BigDecimal.ZERO;
        }
    }
}

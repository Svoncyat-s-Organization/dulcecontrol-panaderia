package com.dulcecontrol.bakery.feature.admin.inventario.entity;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario_insumos")
@Data
public class MovimientoInventarioInsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(name = "tipo_movimiento", nullable = false, length = 50)
    private TipoMovimientoInsumo tipoMovimiento;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidad;

    @Column(name = "cantidad_anterior", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadAnterior;

    @Column(name = "cantidad_posterior", nullable = false, precision = 12, scale = 4)
    private BigDecimal cantidadPosterior;

    @Column(name = "orden_compra_id")
    private Long ordenCompraId;

    @Column(name = "plan_produccion_id")
    private Long planProduccionId;

    @Column(name = "transferencia_id")
    private Long transferenciaId;

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "responsable_id")
    private Long responsableId;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}

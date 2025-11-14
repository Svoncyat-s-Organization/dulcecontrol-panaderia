package com.dulcecontrol.bakery.features.admin.inventario.entity;

import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.MotivoMovimientoProducto;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_inventario_productos")
@Data
public class MovimientoInventarioProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "tipo_movimiento", nullable = false, length = 50)
    private TipoMovimientoInsumo tipoMovimiento;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "cantidad_anterior", nullable = false)
    private Integer cantidadAnterior;

    @Column(name = "cantidad_posterior", nullable = false)
    private Integer cantidadPosterior;

    @Column(name = "pedido_id")
    private Long pedidoId;

    @Column(name = "plan_produccion_id")
    private Long planProduccionId;

    @Column(nullable = false, columnDefinition = "ENUM('produccion', 'venta', 'merma', 'ajuste', 'transferencia', 'devolucion')")
    private MotivoMovimientoProducto motivo;

    @Column(name = "responsable_id")
    private Long responsableId;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}

package com.dulcecontrol.bakery.features.admin.ventas.entity;

import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.MetodoPago;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoMovimientoCaja;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimientos_caja")
@Getter
@Setter
public class MovimientoCaja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sesion_caja_id", nullable = false)
    private Long sesionCajaId;

    @Column(name = "tipo_movimiento", nullable = false, columnDefinition = "ENUM('venta','devolucion','gasto_operativo','retiro_efectivo','ingreso_efectivo','ajuste')")
    private TipoMovimientoCaja tipoMovimiento;

    @Column(name = "monto_centimos", nullable = false)
    private Long montoCentimos;

    @Column(name = "metodo_pago", columnDefinition = "ENUM('efectivo','yape','plin','tarjeta_credito','tarjeta_debito','transferencia','pasarela_online')")
    private MetodoPago metodoPago;

    @Column(name = "pedido_id")
    private Long pedidoId;

    @Column(columnDefinition = "TEXT")
    private String concepto;

    @Column(name = "comprobante_asociado", length = 100)
    private String comprobanteAsociado;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        if (creadoEn == null) {
            creadoEn = LocalDateTime.now();
        }
        if (actualizadoEn == null) {
            actualizadoEn = creadoEn;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

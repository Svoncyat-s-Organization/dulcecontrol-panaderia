package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pago_venta")
public class PagoVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "venta_id", nullable = false)
    private Long ventaId;

    @Column(name = "metodo_pago", length = 20, nullable = false)
    private String metodoPago;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(length = 120)
    private String referencia;

    @Column(name = "recibido_at", nullable = false)
    private OffsetDateTime recibidoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVentaId() {
        return ventaId;
    }

    public void setVentaId(Long ventaId) {
        this.ventaId = ventaId;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public OffsetDateTime getRecibidoAt() {
        return recibidoAt;
    }

    public void setRecibidoAt(OffsetDateTime recibidoAt) {
        this.recibidoAt = recibidoAt;
    }

    @Override
    public String toString() {
        return "PagoVenta [id=" + id + ", ventaId=" + ventaId + ", metodoPago=" + metodoPago + ", monto=" + monto
                + ", referencia=" + referencia + ", recibidoAt=" + recibidoAt + "]";
    }
}
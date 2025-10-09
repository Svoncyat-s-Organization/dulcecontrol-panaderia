package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.dulcecontrol.bakery.enums.MetodoPago;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pago_venta", schema = "dulce_control")
public class PagoVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago", length = 20, nullable = false)
    private MetodoPago metodo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal monto;

    @Size(max = 120)
    @Column(length = 120)
    private String referencia;

    @NotNull
    @Column(name = "recibido_at", nullable = false)
    private OffsetDateTime recibidoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    // Compatibility method
    public Long getVentaId() {
        return venta != null ? venta.getId() : null;
    }

    public void setVentaId(Long ventaId) {
        if (ventaId != null) {
            this.venta = new Venta();
            this.venta.setId(ventaId);
        } else {
            this.venta = null;
        }
    }

    public MetodoPago getMetodo() {
        return metodo;
    }

    public void setMetodo(MetodoPago metodo) {
        this.metodo = metodo;
    }

    // Compatibility method
    public String getMetodoPago() {
        return metodo != null ? metodo.getValor() : null;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodo = metodoPago != null ? MetodoPago.fromValor(metodoPago) : null;
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
        return "PagoVenta [id=" + id + ", ventaId=" + getVentaId() + ", metodoPago=" + getMetodoPago() + ", monto=" + monto
                + ", referencia=" + referencia + ", recibidoAt=" + recibidoAt + "]";
    }
}
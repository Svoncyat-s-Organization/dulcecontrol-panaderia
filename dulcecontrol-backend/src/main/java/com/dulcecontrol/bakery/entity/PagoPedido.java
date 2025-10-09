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
@Table(name = "pago_pedido", schema = "dulce_control")
public class PagoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

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
    @Column(name = "pagado_at", nullable = false)
    private OffsetDateTime pagadoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    // Compatibility method
    public Long getPedidoId() {
        return pedido != null ? pedido.getId() : null;
    }

    public void setPedidoId(Long pedidoId) {
        if (pedidoId != null) {
            this.pedido = new Pedido();
            this.pedido.setId(pedidoId);
        } else {
            this.pedido = null;
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

    public OffsetDateTime getPagadoAt() {
        return pagadoAt;
    }

    public void setPagadoAt(OffsetDateTime pagadoAt) {
        this.pagadoAt = pagadoAt;
    }

    @Override
    public String toString() {
        return "PagoPedido [id=" + id + ", pedidoId=" + getPedidoId() + ", metodoPago=" + getMetodoPago() + ", monto=" + monto
                + ", referencia=" + referencia + ", pagadoAt=" + pagadoAt + "]";
    }
}
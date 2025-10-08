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
@Table(name = "pago_pedido")
public class PagoPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "metodo_pago", length = 20, nullable = false)
    private String metodoPago;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(length = 120)
    private String referencia;

    @Column(name = "pagado_at", nullable = false)
    private OffsetDateTime pagadoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
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

    public OffsetDateTime getPagadoAt() {
        return pagadoAt;
    }

    public void setPagadoAt(OffsetDateTime pagadoAt) {
        this.pagadoAt = pagadoAt;
    }

    @Override
    public String toString() {
        return "PagoPedido [id=" + id + ", pedidoId=" + pedidoId + ", metodoPago=" + metodoPago + ", monto=" + monto
                + ", referencia=" + referencia + ", pagadoAt=" + pagadoAt + "]";
    }
}
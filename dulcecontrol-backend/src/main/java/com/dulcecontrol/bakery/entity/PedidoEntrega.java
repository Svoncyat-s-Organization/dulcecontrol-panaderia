package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.math.BigDecimal;

import com.dulcecontrol.bakery.enums.ModalidadEntrega;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pedido_entrega", schema = "dulce_control")
public class PedidoEntrega implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "pedido_id")
    private Long pedidoId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "pedido_id")
    private Pedido pedido;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private ModalidadEntrega modalidad;

    @Size(max = 250)
    @Column(length = 250)
    private String direccion;

    @Size(max = 250)
    @Column(length = 250)
    private String referencia;

    @Size(max = 80)
    @Column(length = 80)
    private String distrito;

    @DecimalMin(value = "0.0")
    @Column(name = "costo_envio", precision = 12, scale = 2)
    private BigDecimal costoEnvio = BigDecimal.ZERO;

    // --- Getters y Setters ---

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

    public ModalidadEntrega getModalidad() {
        return modalidad;
    }

    public void setModalidad(ModalidadEntrega modalidad) {
        this.modalidad = modalidad;
    }

    // Compatibility method
    public void setModalidad(String modalidad) {
        this.modalidad = modalidad != null ? ModalidadEntrega.fromValor(modalidad) : null;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getReferencia() {
        return referencia;
    }

    public void setReferencia(String referencia) {
        this.referencia = referencia;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(BigDecimal costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    // --- equals() y hashCode() para composite-id ---

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        PedidoEntrega that = (PedidoEntrega) o;
        return pedido != null && pedido.equals(that.pedido);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "PedidoEntrega [pedidoId=" + getPedidoId() + ", modalidad=" + modalidad + ", direccion=" + direccion
                + ", referencia=" + referencia + ", distrito=" + distrito + ", costoEnvio=" + costoEnvio + "]";
    }
}
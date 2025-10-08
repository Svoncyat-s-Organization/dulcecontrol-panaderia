package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido_entrega")
public class PedidoEntrega {

    @Id
    @Column(name = "pedido_id")
    private Long pedidoId;

    @Column(length = 20, nullable = false)
    private String modalidad;

    @Column(length = 250)
    private String direccion;

    @Column(length = 250)
    private String referencia;

    @Column(length = 80)
    private String distrito;

    @Column(name = "costo_envio", precision = 12, scale = 2)
    private BigDecimal costoEnvio = BigDecimal.ZERO;

    // --- Getters y Setters ---

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
    }

    public String getModalidad() {
        return modalidad;
    }

    public void setModalidad(String modalidad) {
        this.modalidad = modalidad;
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

    @Override
    public String toString() {
        return "PedidoEntrega [pedidoId=" + pedidoId + ", modalidad=" + modalidad + ", direccion=" + direccion
                + ", referencia=" + referencia + ", distrito=" + distrito + ", costoEnvio=" + costoEnvio + "]";
    }
}
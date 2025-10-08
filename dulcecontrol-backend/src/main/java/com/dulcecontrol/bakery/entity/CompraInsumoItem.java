package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "compra_insumo_item")
public class CompraInsumoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "compra_id", nullable = false)
    private Long compraId;

    @Column(name = "insumo_id", nullable = false)
    private Long insumoId;

    @Column(precision = 12, scale = 4, nullable = false)
    private BigDecimal cantidad;

    @Column(name = "costo_unitario", precision = 12, scale = 4, nullable = false)
    private BigDecimal costoUnitario;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompraId() {
        return compraId;
    }

    public void setCompraId(Long compraId) {
        this.compraId = compraId;
    }

    public Long getInsumoId() {
        return insumoId;
    }

    public void setInsumoId(Long insumoId) {
        this.insumoId = insumoId;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getCostoUnitario() {
        return costoUnitario;
    }

    public void setCostoUnitario(BigDecimal costoUnitario) {
        this.costoUnitario = costoUnitario;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    @Override
    public String toString() {
        return "CompraInsumoItem [id=" + id + ", compraId=" + compraId + ", insumoId=" + insumoId + ", cantidad="
                + cantidad + ", costoUnitario=" + costoUnitario + ", subtotal=" + subtotal + "]";
    }
}
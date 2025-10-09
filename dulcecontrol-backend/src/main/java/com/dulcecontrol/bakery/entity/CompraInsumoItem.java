package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "compra_insumo_item", schema = "dulce_control")
public class CompraInsumoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "insumo_id", nullable = false)
    private Insumo insumo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 4, nullable = false)
    private BigDecimal cantidad;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "costo_unitario", precision = 12, scale = 4, nullable = false)
    private BigDecimal costoUnitario;

    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal subtotal;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Compra getCompra() {
        return compra;
    }

    public void setCompra(Compra compra) {
        this.compra = compra;
    }

    // Compatibility method
    public Long getCompraId() {
        return compra != null ? compra.getId() : null;
    }

    public void setCompraId(Long compraId) {
        if (compraId != null) {
            this.compra = new Compra();
            this.compra.setId(compraId);
        } else {
            this.compra = null;
        }
    }

    public Insumo getInsumo() {
        return insumo;
    }

    public void setInsumo(Insumo insumo) {
        this.insumo = insumo;
    }

    // Compatibility method
    public Long getInsumoId() {
        return insumo != null ? insumo.getId() : null;
    }

    public void setInsumoId(Long insumoId) {
        if (insumoId != null) {
            this.insumo = new Insumo();
            this.insumo.setId(insumoId);
        } else {
            this.insumo = null;
        }
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
        return "CompraInsumoItem [id=" + id + ", compraId=" + getCompraId() + ", insumoId=" + getInsumoId() + ", cantidad="
                + cantidad + ", costoUnitario=" + costoUnitario + ", subtotal=" + subtotal + "]";
    }
}
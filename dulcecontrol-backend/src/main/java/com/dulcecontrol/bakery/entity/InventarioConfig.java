package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "inventario_config", schema = "dulce_control")
@IdClass(InventarioProductoId.class) // Reuse the same Id class
public class InventarioConfig {

    @Id
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id")
    private Sede sede;

    @Id
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "stock_ideal", precision = 12, scale = 3, nullable = false)
    private BigDecimal stockIdeal;

    // --- Getters y Setters ---

    public Sede getSede() {
        return sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    // Compatibility method
    public Long getSedeId() {
        return sede != null ? sede.getId() : null;
    }

    public void setSedeId(Long sedeId) {
        if (sedeId != null) {
            this.sede = new Sede();
            this.sede.setId(sedeId);
        } else {
            this.sede = null;
        }
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    // Compatibility method
    public Long getProductoId() {
        return producto != null ? producto.getId() : null;
    }

    public void setProductoId(Long productoId) {
        if (productoId != null) {
            this.producto = new Producto();
            this.producto.setId(productoId);
        } else {
            this.producto = null;
        }
    }

    public BigDecimal getStockIdeal() {
        return stockIdeal;
    }

    public void setStockIdeal(BigDecimal stockIdeal) {
        this.stockIdeal = stockIdeal;
    }

    @Override
    public String toString() {
        return "InventarioConfig [sedeId=" + getSedeId() + ", productoId=" + getProductoId() + ", stockIdeal=" + stockIdeal + "]";
    }
}
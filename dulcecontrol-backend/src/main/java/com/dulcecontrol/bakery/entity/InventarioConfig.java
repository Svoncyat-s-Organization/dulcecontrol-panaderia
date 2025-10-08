package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventario_config")
@IdClass(InventarioProductoId.class) // Reuse the same Id class
public class InventarioConfig {

    @Id
    @Column(name = "sede_id")
    private Long sedeId;

    @Id
    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "stock_ideal", precision = 12, scale = 3, nullable = false)
    private BigDecimal stockIdeal;

    // --- Getters y Setters ---

    public Long getSedeId() {
        return sedeId;
    }

    public void setSedeId(Long sedeId) {
        this.sedeId = sedeId;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public BigDecimal getStockIdeal() {
        return stockIdeal;
    }

    public void setStockIdeal(BigDecimal stockIdeal) {
        this.stockIdeal = stockIdeal;
    }

    @Override
    public String toString() {
        return "InventarioConfig [sedeId=" + sedeId + ", productoId=" + productoId + ", stockIdeal=" + stockIdeal + "]";
    }
}
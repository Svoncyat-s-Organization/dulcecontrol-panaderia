package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventario_producto")
@IdClass(InventarioProductoId.class)
public class InventarioProducto {

    @Id
    @Column(name = "sede_id")
    private Long sedeId;

    @Id
    @Column(name = "producto_id")
    private Long productoId;

    @Column(name = "stock_actual", precision = 12, scale = 3, nullable = false)
    private BigDecimal stockActual = BigDecimal.ZERO;

    @Column(name = "stock_minimo", precision = 12, scale = 3, nullable = false)
    private BigDecimal stockMinimo = BigDecimal.ZERO;

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

    public BigDecimal getStockActual() {
        return stockActual;
    }

    public void setStockActual(BigDecimal stockActual) {
        this.stockActual = stockActual;
    }

    public BigDecimal getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(BigDecimal stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    @Override
    public String toString() {
        return "InventarioProducto [sedeId=" + sedeId + ", productoId=" + productoId + ", stockActual=" + stockActual
                + ", stockMinimo=" + stockMinimo + "]";
    }
}
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
@Table(name = "venta_item", schema = "dulce_control")
public class VentaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venta_id", nullable = false)
    private Venta venta;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidad;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "precio_unitario", precision = 12, scale = 2, nullable = false)
    private BigDecimal precioUnitario;

    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal descuento = BigDecimal.ZERO;

    // Campo calculado por trigger - no debe ser modificado desde la aplicación
    @DecimalMin(value = "0.0")
    @Column(name = "total_item", precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal totalItem;

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

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public void setDescuento(BigDecimal descuento) {
        this.descuento = descuento;
    }

    public BigDecimal getTotalItem() {
        return totalItem;
    }

    public void setTotalItem(BigDecimal totalItem) {
        this.totalItem = totalItem;
    }

    @Override
    public String toString() {
        return "VentaItem [id=" + id + ", ventaId=" + getVentaId() + ", productoId=" + getProductoId() + ", cantidad=" + cantidad
                + ", precioUnitario=" + precioUnitario + ", descuento=" + descuento + ", totalItem=" + totalItem + "]";
    }
}
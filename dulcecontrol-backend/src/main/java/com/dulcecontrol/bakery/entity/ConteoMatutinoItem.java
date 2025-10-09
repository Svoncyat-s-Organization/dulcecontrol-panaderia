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
@Table(name = "conteo_matutino_item", schema = "dulce_control")
public class ConteoMatutinoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conteo_id", nullable = false)
    private ConteoMatutino conteo;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidad;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ConteoMatutino getConteo() {
        return conteo;
    }

    public void setConteo(ConteoMatutino conteo) {
        this.conteo = conteo;
    }

    // Compatibility method
    public Long getConteoId() {
        return conteo != null ? conteo.getId() : null;
    }

    public void setConteoId(Long conteoId) {
        if (conteoId != null) {
            this.conteo = new ConteoMatutino();
            this.conteo.setId(conteoId);
        } else {
            this.conteo = null;
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

    @Override
    public String toString() {
        return "ConteoMatutinoItem [id=" + id + ", conteoId=" + getConteoId() + ", productoId=" + getProductoId() + ", cantidad="
                + cantidad + "]";
    }
}
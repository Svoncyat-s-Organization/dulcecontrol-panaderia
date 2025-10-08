package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "conteo_matutino_item")
public class ConteoMatutinoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "conteo_id", nullable = false)
    private Long conteoId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidad;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getConteoId() {
        return conteoId;
    }

    public void setConteoId(Long conteoId) {
        this.conteoId = conteoId;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    @Override
    public String toString() {
        return "ConteoMatutinoItem [id=" + id + ", conteoId=" + conteoId + ", productoId=" + productoId + ", cantidad="
                + cantidad + "]";
    }
}
package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

public class InventarioProductoId implements Serializable {
    private Sede sede;
    private Producto producto;

    public InventarioProductoId() {
    }

    public InventarioProductoId(Sede sede, Producto producto) {
        this.sede = sede;
        this.producto = producto;
    }

    // Constructor de compatibilidad para controllers
    public InventarioProductoId(Long sedeId, Long productoId) {
        if (sedeId != null) {
            this.sede = new Sede();
            this.sede.setId(sedeId);
        }
        if (productoId != null) {
            this.producto = new Producto();
            this.producto.setId(productoId);
        }
    }

    public Sede getSede() {
        return sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        InventarioProductoId that = (InventarioProductoId) o;
        return Objects.equals(sede, that.sede) && Objects.equals(producto, that.producto);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sede, producto);
    }
}
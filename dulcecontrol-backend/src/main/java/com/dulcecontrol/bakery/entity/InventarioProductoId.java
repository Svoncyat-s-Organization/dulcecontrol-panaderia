package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

public class InventarioProductoId implements Serializable {
    private Long sedeId;
    private Long productoId;

    public InventarioProductoId() {
    }

    public InventarioProductoId(Long sedeId, Long productoId) {
        this.sedeId = sedeId;
        this.productoId = productoId;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        InventarioProductoId that = (InventarioProductoId) o;
        return Objects.equals(sedeId, that.sedeId) && Objects.equals(productoId, that.productoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sedeId, productoId);
    }
}
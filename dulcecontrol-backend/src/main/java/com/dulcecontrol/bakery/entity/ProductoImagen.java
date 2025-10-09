package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "producto_imagen", schema = "dulce_control")
public class ProductoImagen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @NotBlank
    @Size(max = 400)
    @Column(length = 400, nullable = false)
    private String url;

    @NotNull
    @Min(1)
    @Column(nullable = false)
    private Integer orden = 1;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Integer getOrden() {
        return orden;
    }

    public void setOrden(Integer orden) {
        this.orden = orden;
    }

    @Override
    public String toString() {
        return "ProductoImagen [id=" + id + ", productoId=" + getProductoId() + ", url=" + url + ", orden=" + orden + "]";
    }
}
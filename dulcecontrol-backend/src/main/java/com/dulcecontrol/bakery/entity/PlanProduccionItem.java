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
@Table(name = "plan_produccion_item", schema = "dulce_control")
public class PlanProduccionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private PlanProduccion plan;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "cantidad_objetivo", precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidadObjetivo;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "cantidad_completada", precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidadCompletada = BigDecimal.ZERO;

    @NotNull
    @Column(nullable = false)
    private Boolean completado = false;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlanProduccion getPlan() {
        return plan;
    }

    public void setPlan(PlanProduccion plan) {
        this.plan = plan;
    }

    // Compatibility method
    public Long getPlanId() {
        return plan != null ? plan.getId() : null;
    }

    public void setPlanId(Long planId) {
        if (planId != null) {
            this.plan = new PlanProduccion();
            this.plan.setId(planId);
        } else {
            this.plan = null;
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

    public BigDecimal getCantidadObjetivo() {
        return cantidadObjetivo;
    }

    public void setCantidadObjetivo(BigDecimal cantidadObjetivo) {
        this.cantidadObjetivo = cantidadObjetivo;
    }

    public BigDecimal getCantidadCompletada() {
        return cantidadCompletada;
    }

    public void setCantidadCompletada(BigDecimal cantidadCompletada) {
        this.cantidadCompletada = cantidadCompletada;
    }

    public Boolean getCompletado() {
        return completado;
    }

    public void setCompletado(Boolean completado) {
        this.completado = completado;
    }

    @Override
    public String toString() {
        return "PlanProduccionItem [id=" + id + ", planId=" + getPlanId() + ", productoId=" + getProductoId()
                + ", cantidadObjetivo=" + cantidadObjetivo + ", cantidadCompletada=" + cantidadCompletada
                + ", completado=" + completado + "]";
    }
}
package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "plan_produccion_item")
public class PlanProduccionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @Column(name = "cantidad_objetivo", precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidadObjetivo;

    @Column(name = "cantidad_completada", precision = 12, scale = 3, nullable = false)
    private BigDecimal cantidadCompletada = BigDecimal.ZERO;

    @Column(nullable = false)
    private Boolean completado = false;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public Long getProductoId() {
        return productoId;
    }

    public void setProductoId(Long productoId) {
        this.productoId = productoId;
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
        return "PlanProduccionItem [id=" + id + ", planId=" + planId + ", productoId=" + productoId
                + ", cantidadObjetivo=" + cantidadObjetivo + ", cantidadCompletada=" + cantidadCompletada
                + ", completado=" + completado + "]";
    }
}
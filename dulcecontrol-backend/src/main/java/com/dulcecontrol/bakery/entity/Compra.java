package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "compra", schema = "dulce_control")
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;

    @NotNull
    @Column(nullable = false)
    private LocalDate fecha;

    @NotBlank
    @Size(max = 20)
    @Column(length = 20, nullable = false)
    private String estado = "registrada";

    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal impuesto = BigDecimal.ZERO;

    @DecimalMin(value = "0.0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal total = BigDecimal.ZERO;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private OffsetDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime actualizadoEn;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sede getSede() {
        return sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    // Compatibility method
    public Long getSedeId() {
        return sede != null ? sede.getId() : null;
    }

    public void setSedeId(Long sedeId) {
        if (sedeId != null) {
            this.sede = new Sede();
            this.sede.setId(sedeId);
        } else {
            this.sede = null;
        }
    }

    public Proveedor getProveedor() {
        return proveedor;
    }

    public void setProveedor(Proveedor proveedor) {
        this.proveedor = proveedor;
    }

    // Compatibility method
    public Long getProveedorId() {
        return proveedor != null ? proveedor.getId() : null;
    }

    public void setProveedorId(Long proveedorId) {
        if (proveedorId != null) {
            this.proveedor = new Proveedor();
            this.proveedor.setId(proveedorId);
        } else {
            this.proveedor = null;
        }
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getImpuesto() {
        return impuesto;
    }

    public void setImpuesto(BigDecimal impuesto) {
        this.impuesto = impuesto;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public OffsetDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(OffsetDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public OffsetDateTime getActualizadoEn() {
        return actualizadoEn;
    }

    public void setActualizadoEn(OffsetDateTime actualizadoEn) {
        this.actualizadoEn = actualizadoEn;
    }

    @Override
    public String toString() {
        return "Compra [id=" + id + ", sedeId=" + getSedeId() + ", proveedorId=" + getProveedorId() + ", fecha=" + fecha
                + ", estado=" + estado + ", subtotal=" + subtotal + ", impuesto=" + impuesto + ", total=" + total
                + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.dulcecontrol.bakery.enums.TipoGasto;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "gasto", schema = "dulce_control")
public class Gasto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La sede es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private LocalDate fecha;

    @NotNull(message = "El tipo de gasto es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(name = "categoria", length = 60, nullable = false)
    private TipoGasto tipo;

    @Size(max = 250, message = "La descripción no puede exceder 250 caracteres")
    @Column(length = 250)
    private String descripcion;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.0", message = "El monto debe ser mayor o igual a 0")
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal monto;

    @Column(name = "comprobante_tipo", length = 20)
    private String comprobanteTipo;

    @Column(name = "comprobante_serie", length = 10)
    private String comprobanteSerie;

    @Column(name = "comprobante_numero", length = 20)
    private String comprobanteNumero;

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

    // Método de compatibilidad
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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public TipoGasto getTipo() {
        return tipo;
    }

    public void setTipo(TipoGasto tipo) {
        this.tipo = tipo;
    }

    // Método de compatibilidad para categoria
    public String getCategoria() {
        return tipo != null ? tipo.getValor() : null;
    }

    public void setCategoria(String categoria) {
        if (categoria != null) {
            this.tipo = TipoGasto.fromValor(categoria);
        }
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getComprobanteTipo() {
        return comprobanteTipo;
    }

    public void setComprobanteTipo(String comprobanteTipo) {
        this.comprobanteTipo = comprobanteTipo;
    }

    public String getComprobanteSerie() {
        return comprobanteSerie;
    }

    public void setComprobanteSerie(String comprobanteSerie) {
        this.comprobanteSerie = comprobanteSerie;
    }

    public String getComprobanteNumero() {
        return comprobanteNumero;
    }

    public void setComprobanteNumero(String comprobanteNumero) {
        this.comprobanteNumero = comprobanteNumero;
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
        return "Gasto [id=" + id + ", sedeId=" + getSedeId() + ", fecha=" + fecha + ", tipo=" + tipo
                + ", descripcion=" + descripcion + ", monto=" + monto + ", comprobanteTipo=" + comprobanteTipo
                + ", comprobanteSerie=" + comprobanteSerie + ", comprobanteNumero=" + comprobanteNumero + ", creadoEn="
                + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
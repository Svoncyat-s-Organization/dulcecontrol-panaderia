package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
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
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "caja_sesion", schema = "dulce_control")
public class CajaSesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_apertura_id", nullable = false)
    private Usuario usuarioApertura;

    @NotNull
    @Column(name = "apertura_at", nullable = false)
    private OffsetDateTime aperturaAt;

    @NotNull
    @DecimalMin(value = "0.0")
    @Column(name = "monto_apertura", precision = 12, scale = 2, nullable = false)
    private BigDecimal montoApertura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_cierre_id")
    private Usuario usuarioCierre;

    @Column(name = "cierre_at")
    private OffsetDateTime cierreAt;

    @DecimalMin(value = "0.0")
    @Column(name = "monto_cierre", precision = 12, scale = 2)
    private BigDecimal montoCierre;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

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

    public Usuario getUsuarioApertura() {
        return usuarioApertura;
    }

    public void setUsuarioApertura(Usuario usuarioApertura) {
        this.usuarioApertura = usuarioApertura;
    }

    // Compatibility method
    public Long getUsuarioAperturaId() {
        return usuarioApertura != null ? usuarioApertura.getId() : null;
    }

    public void setUsuarioAperturaId(Long usuarioAperturaId) {
        if (usuarioAperturaId != null) {
            this.usuarioApertura = new Usuario();
            this.usuarioApertura.setId(usuarioAperturaId);
        } else {
            this.usuarioApertura = null;
        }
    }

    public OffsetDateTime getAperturaAt() {
        return aperturaAt;
    }

    public void setAperturaAt(OffsetDateTime aperturaAt) {
        this.aperturaAt = aperturaAt;
    }

    public BigDecimal getMontoApertura() {
        return montoApertura;
    }

    public void setMontoApertura(BigDecimal montoApertura) {
        this.montoApertura = montoApertura;
    }

    public Usuario getUsuarioCierre() {
        return usuarioCierre;
    }

    public void setUsuarioCierre(Usuario usuarioCierre) {
        this.usuarioCierre = usuarioCierre;
    }

    // Compatibility method
    public Long getUsuarioCierreId() {
        return usuarioCierre != null ? usuarioCierre.getId() : null;
    }

    public void setUsuarioCierreId(Long usuarioCierreId) {
        if (usuarioCierreId != null) {
            this.usuarioCierre = new Usuario();
            this.usuarioCierre.setId(usuarioCierreId);
        } else {
            this.usuarioCierre = null;
        }
    }

    public OffsetDateTime getCierreAt() {
        return cierreAt;
    }

    public void setCierreAt(OffsetDateTime cierreAt) {
        this.cierreAt = cierreAt;
    }

    public BigDecimal getMontoCierre() {
        return montoCierre;
    }

    public void setMontoCierre(BigDecimal montoCierre) {
        this.montoCierre = montoCierre;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
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
        return "CajaSesion [id=" + id + ", sedeId=" + getSedeId() + ", usuarioAperturaId=" + getUsuarioAperturaId()
                + ", aperturaAt=" + aperturaAt + ", montoApertura=" + montoApertura + ", usuarioCierreId="
                + getUsuarioCierreId() + ", cierreAt=" + cierreAt + ", montoCierre=" + montoCierre + ", observaciones="
                + observaciones + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
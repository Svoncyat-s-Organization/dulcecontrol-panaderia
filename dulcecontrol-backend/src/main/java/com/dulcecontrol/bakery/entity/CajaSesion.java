package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "caja_sesion")
public class CajaSesion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "usuario_apertura_id", nullable = false)
    private Long usuarioAperturaId;

    @Column(name = "apertura_at", nullable = false)
    private OffsetDateTime aperturaAt;

    @Column(name = "monto_apertura", precision = 12, scale = 2, nullable = false)
    private BigDecimal montoApertura;

    @Column(name = "usuario_cierre_id")
    private Long usuarioCierreId;

    @Column(name = "cierre_at")
    private OffsetDateTime cierreAt;

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

    public Long getSedeId() {
        return sedeId;
    }

    public void setSedeId(Long sedeId) {
        this.sedeId = sedeId;
    }

    public Long getUsuarioAperturaId() {
        return usuarioAperturaId;
    }

    public void setUsuarioAperturaId(Long usuarioAperturaId) {
        this.usuarioAperturaId = usuarioAperturaId;
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

    public Long getUsuarioCierreId() {
        return usuarioCierreId;
    }

    public void setUsuarioCierreId(Long usuarioCierreId) {
        this.usuarioCierreId = usuarioCierreId;
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
        return "CajaSesion [id=" + id + ", sedeId=" + sedeId + ", usuarioAperturaId=" + usuarioAperturaId
                + ", aperturaAt=" + aperturaAt + ", montoApertura=" + montoApertura + ", usuarioCierreId="
                + usuarioCierreId + ", cierreAt=" + cierreAt + ", montoCierre=" + montoCierre + ", observaciones="
                + observaciones + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
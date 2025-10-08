package com.dulcecontrol.bakery.entity;

import java.time.LocalDate;
import java.time.LocalTime;
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
@Table(name = "pedido")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "hora_entrega")
    private LocalTime horaEntrega;

    @Column(length = 20, nullable = false)
    private String estado = "pendiente";

    @Column(length = 20, nullable = false)
    private String origen = "local";

    @Column(name = "pago_online_estado", length = 20)
    private String pagoOnlineEstado;

    @Column(name = "pago_online_referencia", length = 120)
    private String pagoOnlineReferencia;

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

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public OffsetDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(OffsetDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public LocalDate getFechaEntrega() {
        return fechaEntrega;
    }

    public void setFechaEntrega(LocalDate fechaEntrega) {
        this.fechaEntrega = fechaEntrega;
    }

    public LocalTime getHoraEntrega() {
        return horaEntrega;
    }

    public void setHoraEntrega(LocalTime horaEntrega) {
        this.horaEntrega = horaEntrega;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getOrigen() {
        return origen;
    }

    public void setOrigen(String origen) {
        this.origen = origen;
    }

    public String getPagoOnlineEstado() {
        return pagoOnlineEstado;
    }

    public void setPagoOnlineEstado(String pagoOnlineEstado) {
        this.pagoOnlineEstado = pagoOnlineEstado;
    }

    public String getPagoOnlineReferencia() {
        return pagoOnlineReferencia;
    }

    public void setPagoOnlineReferencia(String pagoOnlineReferencia) {
        this.pagoOnlineReferencia = pagoOnlineReferencia;
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
        return "Pedido [id=" + id + ", sedeId=" + sedeId + ", clienteId=" + clienteId + ", fechaCreacion="
                + fechaCreacion + ", fechaEntrega=" + fechaEntrega + ", horaEntrega=" + horaEntrega + ", estado="
                + estado + ", origen=" + origen + ", pagoOnlineEstado=" + pagoOnlineEstado + ", pagoOnlineReferencia="
                + pagoOnlineReferencia + ", observaciones=" + observaciones + ", creadoEn=" + creadoEn
                + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
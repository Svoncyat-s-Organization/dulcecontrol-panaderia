package com.dulcecontrol.bakery.entity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.dulcecontrol.bakery.enums.EstadoPedido;
import com.dulcecontrol.bakery.enums.EstadoPagoOnline;
import com.dulcecontrol.bakery.enums.OrigenPedido;

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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pedido", schema = "dulce_control")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @NotNull
    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion;

    @Column(name = "fecha_entrega")
    private LocalDate fechaEntrega;

    @Column(name = "hora_entrega")
    private LocalTime horaEntrega;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private OrigenPedido origen = OrigenPedido.LOCAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "pago_online_estado", length = 20)
    private EstadoPagoOnline pagoOnlineEstado;

    @Size(max = 120)
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    // Compatibility method
    public Long getClienteId() {
        return cliente != null ? cliente.getId() : null;
    }

    public void setClienteId(Long clienteId) {
        if (clienteId != null) {
            this.cliente = new Cliente();
            this.cliente.setId(clienteId);
        } else {
            this.cliente = null;
        }
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

    public EstadoPedido getEstado() {
        return estado;
    }

    public void setEstado(EstadoPedido estado) {
        this.estado = estado;
    }

    // Compatibility method for String estado
    public void setEstado(String estado) {
        this.estado = estado != null ? EstadoPedido.fromValor(estado) : null;
    }

    public OrigenPedido getOrigen() {
        return origen;
    }

    public void setOrigen(OrigenPedido origen) {
        this.origen = origen;
    }

    // Compatibility method for String origen
    public void setOrigen(String origen) {
        this.origen = origen != null ? OrigenPedido.fromValor(origen) : null;
    }

    public EstadoPagoOnline getPagoOnlineEstado() {
        return pagoOnlineEstado;
    }

    public void setPagoOnlineEstado(EstadoPagoOnline pagoOnlineEstado) {
        this.pagoOnlineEstado = pagoOnlineEstado;
    }

    // Compatibility method for String pagoOnlineEstado
    public void setPagoOnlineEstado(String pagoOnlineEstado) {
        this.pagoOnlineEstado = pagoOnlineEstado != null ? EstadoPagoOnline.fromValor(pagoOnlineEstado) : null;
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
        return "Pedido [id=" + id + ", sedeId=" + getSedeId() + ", clienteId=" + getClienteId() + ", fechaCreacion="
                + fechaCreacion + ", fechaEntrega=" + fechaEntrega + ", horaEntrega=" + horaEntrega + ", estado="
                + estado + ", origen=" + origen + ", pagoOnlineEstado=" + pagoOnlineEstado + ", pagoOnlineReferencia="
                + pagoOnlineReferencia + ", observaciones=" + observaciones + ", creadoEn=" + creadoEn
                + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
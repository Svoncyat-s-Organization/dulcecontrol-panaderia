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
@Table(name = "venta")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sede_id", nullable = false)
    private Long sedeId;

    @Column(name = "caja_sesion_id")
    private Long cajaSesionId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(nullable = false)
    private OffsetDateTime fecha;

    @Column(length = 20, nullable = false)
    private String estado = "emitida";

    @Column(length = 3, nullable = false)
    private String moneda = "PEN";

    @Column(name = "comprobante_tipo", length = 20)
    private String comprobanteTipo;

    @Column(name = "comprobante_serie", length = 10)
    private String comprobanteSerie;

    @Column(name = "comprobante_numero", length = 20)
    private String comprobanteNumero;

    @Column(name = "sunat_estado", length = 20)
    private String sunatEstado = "pendiente";

    @Column(name = "sunat_mensaje", columnDefinition = "TEXT")
    private String sunatMensaje;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(name = "impuesto_porcentaje", precision = 5, scale = 2, nullable = false)
    private BigDecimal impuestoPorcentaje = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal impuesto = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "anulado_at")
    private OffsetDateTime anuladoAt;

    @Column(name = "anulado_por_id")
    private Long anuladoPorId;

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

    public Long getCajaSesionId() {
        return cajaSesionId;
    }

    public void setCajaSesionId(Long cajaSesionId) {
        this.cajaSesionId = cajaSesionId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public OffsetDateTime getFecha() {
        return fecha;
    }

    public void setFecha(OffsetDateTime fecha) {
        this.fecha = fecha;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
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

    public String getSunatEstado() {
        return sunatEstado;
    }

    public void setSunatEstado(String sunatEstado) {
        this.sunatEstado = sunatEstado;
    }

    public String getSunatMensaje() {
        return sunatMensaje;
    }

    public void setSunatMensaje(String sunatMensaje) {
        this.sunatMensaje = sunatMensaje;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getImpuestoPorcentaje() {
        return impuestoPorcentaje;
    }

    public void setImpuestoPorcentaje(BigDecimal impuestoPorcentaje) {
        this.impuestoPorcentaje = impuestoPorcentaje;
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

    public OffsetDateTime getAnuladoAt() {
        return anuladoAt;
    }

    public void setAnuladoAt(OffsetDateTime anuladoAt) {
        this.anuladoAt = anuladoAt;
    }

    public Long getAnuladoPorId() {
        return anuladoPorId;
    }

    public void setAnuladoPorId(Long anuladoPorId) {
        this.anuladoPorId = anuladoPorId;
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
        return "Venta [id=" + id + ", sedeId=" + sedeId + ", cajaSesionId=" + cajaSesionId + ", usuarioId=" + usuarioId
                + ", clienteId=" + clienteId + ", fecha=" + fecha + ", estado=" + estado + ", moneda=" + moneda
                + ", comprobanteTipo=" + comprobanteTipo + ", comprobanteSerie=" + comprobanteSerie
                + ", comprobanteNumero=" + comprobanteNumero + ", sunatEstado=" + sunatEstado + ", sunatMensaje="
                + sunatMensaje + ", subtotal=" + subtotal + ", impuestoPorcentaje=" + impuestoPorcentaje + ", impuesto="
                + impuesto + ", total=" + total + ", anuladoAt=" + anuladoAt + ", anuladoPorId=" + anuladoPorId
                + ", creadoEn=" + creadoEn + ", actualizadoEn=" + actualizadoEn + "]";
    }
}
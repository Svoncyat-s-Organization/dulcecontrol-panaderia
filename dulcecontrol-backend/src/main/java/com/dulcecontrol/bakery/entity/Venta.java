package com.dulcecontrol.bakery.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.dulcecontrol.bakery.enums.EstadoVenta;
import com.dulcecontrol.bakery.enums.TipoComprobante;

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
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "venta", schema = "dulce_control")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La sede es obligatoria")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "caja_sesion_id")
    private CajaSesion cajaSesion;

    @NotNull(message = "El usuario es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @NotNull(message = "La fecha es obligatoria")
    @Column(nullable = false)
    private OffsetDateTime fecha;

    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private EstadoVenta estado = EstadoVenta.EMITIDA;

    @NotNull(message = "La moneda es obligatoria")
    @Pattern(regexp = "PEN", message = "Solo se acepta moneda PEN")
    @Column(length = 3, nullable = false)
    private String moneda = "PEN";

    @Enumerated(EnumType.STRING)
    @Column(name = "comprobante_tipo", length = 20)
    private TipoComprobante comprobanteTipo;

    @Column(name = "comprobante_serie", length = 10)
    private String comprobanteSerie;

    @Column(name = "comprobante_numero", length = 20)
    private String comprobanteNumero;

    @Column(name = "sunat_estado", length = 20)
    private String sunatEstado = "pendiente";

    @Column(name = "sunat_mensaje", columnDefinition = "TEXT")
    private String sunatMensaje;

    // Campos calculados por trigger - Solo lectura
    @DecimalMin(value = "0.0", message = "El subtotal debe ser mayor o igual a 0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "El porcentaje de impuesto debe ser mayor o igual a 0")
    @Column(name = "impuesto_porcentaje", precision = 5, scale = 2, nullable = false)
    private BigDecimal impuestoPorcentaje = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "El impuesto debe ser mayor o igual a 0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal impuesto = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", message = "El total debe ser mayor o igual a 0")
    @Column(precision = 12, scale = 2, nullable = false, insertable = false, updatable = false)
    private BigDecimal total = BigDecimal.ZERO;

    @Column(name = "anulado_at")
    private OffsetDateTime anuladoAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anulado_por_id")
    private Usuario anuladoPor;

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

    public CajaSesion getCajaSesion() {
        return cajaSesion;
    }

    public void setCajaSesion(CajaSesion cajaSesion) {
        this.cajaSesion = cajaSesion;
    }

    // Compatibility method
    public Long getCajaSesionId() {
        return cajaSesion != null ? cajaSesion.getId() : null;
    }

    public void setCajaSesionId(Long cajaSesionId) {
        if (cajaSesionId != null) {
            this.cajaSesion = new CajaSesion();
            this.cajaSesion.setId(cajaSesionId);
        } else {
            this.cajaSesion = null;
        }
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    // Compatibility method
    public Long getUsuarioId() {
        return usuario != null ? usuario.getId() : null;
    }

    public void setUsuarioId(Long usuarioId) {
        if (usuarioId != null) {
            this.usuario = new Usuario();
            this.usuario.setId(usuarioId);
        } else {
            this.usuario = null;
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

    public OffsetDateTime getFecha() {
        return fecha;
    }

    public void setFecha(OffsetDateTime fecha) {
        this.fecha = fecha;
    }

    public EstadoVenta getEstado() {
        return estado;
    }

    public void setEstado(EstadoVenta estado) {
        this.estado = estado;
    }

    // Compatibility method for String
    public void setEstado(String estadoStr) {
        this.estado = EstadoVenta.fromValor(estadoStr);
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public TipoComprobante getComprobanteTipo() {
        return comprobanteTipo;
    }

    public void setComprobanteTipo(TipoComprobante comprobanteTipo) {
        this.comprobanteTipo = comprobanteTipo;
    }

    // Compatibility method for String
    public void setComprobanteTipo(String tipoStr) {
        this.comprobanteTipo = TipoComprobante.fromValor(tipoStr);
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

    public Usuario getAnuladoPor() {
        return anuladoPor;
    }

    public void setAnuladoPor(Usuario anuladoPor) {
        this.anuladoPor = anuladoPor;
    }

    // Compatibility method
    public Long getAnuladoPorId() {
        return anuladoPor != null ? anuladoPor.getId() : null;
    }

    public void setAnuladoPorId(Long anuladoPorId) {
        if (anuladoPorId != null) {
            this.anuladoPor = new Usuario();
            this.anuladoPor.setId(anuladoPorId);
        } else {
            this.anuladoPor = null;
        }
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
        return "Venta{" +
                "id=" + id +
                ", sedeId=" + getSedeId() +
                ", cajaSesionId=" + getCajaSesionId() +
                ", usuarioId=" + getUsuarioId() +
                ", clienteId=" + getClienteId() +
                ", fecha=" + fecha +
                ", estado=" + (estado != null ? estado.getValor() : null) +
                ", moneda='" + moneda + '\'' +
                ", comprobanteTipo=" + (comprobanteTipo != null ? comprobanteTipo.getValor() : null) +
                ", comprobanteSerie='" + comprobanteSerie + '\'' +
                ", comprobanteNumero='" + comprobanteNumero + '\'' +
                ", sunatEstado='" + sunatEstado + '\'' +
                ", subtotal=" + subtotal +
                ", impuestoPorcentaje=" + impuestoPorcentaje +
                ", impuesto=" + impuesto +
                ", total=" + total +
                ", anuladoAt=" + anuladoAt +
                ", anuladoPorId=" + getAnuladoPorId() +
                ", creadoEn=" + creadoEn +
                ", actualizadoEn=" + actualizadoEn +
                '}';
    }
}
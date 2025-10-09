package com.dulcecontrol.bakery.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "pedido_adjunto", schema = "dulce_control")
public class PedidoAdjunto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @NotBlank
    @Size(max = 400)
    @Column(name = "ruta_archivo", length = 400, nullable = false)
    private String rutaArchivo;

    @Size(max = 80)
    @Column(name = "tipo_mime", length = 80)
    private String tipoMime;

    @Min(0)
    @Column(name = "tamano_bytes")
    private Long tamanoBytes;

    @NotNull
    @Column(name = "subido_at", nullable = false)
    private OffsetDateTime subidoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pedido getPedido() {
        return pedido;
    }

    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }

    // Compatibility method
    public Long getPedidoId() {
        return pedido != null ? pedido.getId() : null;
    }

    public void setPedidoId(Long pedidoId) {
        if (pedidoId != null) {
            this.pedido = new Pedido();
            this.pedido.setId(pedidoId);
        } else {
            this.pedido = null;
        }
    }

    public String getRutaArchivo() {
        return rutaArchivo;
    }

    public void setRutaArchivo(String rutaArchivo) {
        this.rutaArchivo = rutaArchivo;
    }

    public String getTipoMime() {
        return tipoMime;
    }

    public void setTipoMime(String tipoMime) {
        this.tipoMime = tipoMime;
    }

    public Long getTamanoBytes() {
        return tamanoBytes;
    }

    public void setTamanoBytes(Long tamanoBytes) {
        this.tamanoBytes = tamanoBytes;
    }

    public OffsetDateTime getSubidoAt() {
        return subidoAt;
    }

    public void setSubidoAt(OffsetDateTime subidoAt) {
        this.subidoAt = subidoAt;
    }

    @Override
    public String toString() {
        return "PedidoAdjunto [id=" + id + ", pedidoId=" + getPedidoId() + ", rutaArchivo=" + rutaArchivo + ", tipoMime="
                + tipoMime + ", tamanoBytes=" + tamanoBytes + ", subidoAt=" + subidoAt + "]";
    }
}
package com.dulcecontrol.bakery.entity;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pedido_adjunto")
public class PedidoAdjunto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;

    @Column(name = "ruta_archivo", length = 400, nullable = false)
    private String rutaArchivo;

    @Column(name = "tipo_mime", length = 80)
    private String tipoMime;

    @Column(name = "tamano_bytes")
    private Long tamanoBytes;

    @Column(name = "subido_at", nullable = false)
    private OffsetDateTime subidoAt;

    // --- Getters y Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPedidoId() {
        return pedidoId;
    }

    public void setPedidoId(Long pedidoId) {
        this.pedidoId = pedidoId;
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
        return "PedidoAdjunto [id=" + id + ", pedidoId=" + pedidoId + ", rutaArchivo=" + rutaArchivo + ", tipoMime="
                + tipoMime + ", tamanoBytes=" + tamanoBytes + ", subidoAt=" + subidoAt + "]";
    }
}
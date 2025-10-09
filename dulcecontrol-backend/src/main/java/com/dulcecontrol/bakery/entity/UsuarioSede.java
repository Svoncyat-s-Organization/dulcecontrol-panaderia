package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario_sede", schema = "dulce_control")
@IdClass(UsuarioSedeId.class)
public class UsuarioSede {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    // --- Getters y Setters ---

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Sede getSede() {
        return sede;
    }

    public void setSede(Sede sede) {
        this.sede = sede;
    }

    // Métodos de compatibilidad
    public Long getUsuarioId() {
        return usuario != null ? usuario.getId() : null;
    }

    public void setUsuarioId(Long usuarioId) {
        if (this.usuario == null) {
            this.usuario = new Usuario();
        }
        this.usuario.setId(usuarioId);
    }

    public Long getSedeId() {
        return sede != null ? sede.getId() : null;
    }

    public void setSedeId(Long sedeId) {
        if (this.sede == null) {
            this.sede = new Sede();
        }
        this.sede.setId(sedeId);
    }

    @Override
    public String toString() {
        return "UsuarioSede [usuarioId=" + getUsuarioId() + ", sedeId=" + getSedeId() + "]";
    }
}
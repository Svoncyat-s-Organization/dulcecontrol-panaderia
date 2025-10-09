package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario_rol", schema = "dulce_control")
@IdClass(UsuarioRolId.class)
public class UsuarioRol {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    // --- Getters y Setters ---

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
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

    public Long getRolId() {
        return rol != null ? rol.getId() : null;
    }

    public void setRolId(Long rolId) {
        if (this.rol == null) {
            this.rol = new Rol();
        }
        this.rol.setId(rolId);
    }

    @Override
    public String toString() {
        return "UsuarioRol [usuarioId=" + getUsuarioId() + ", rolId=" + getRolId() + "]";
    }
}
package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioRolId implements Serializable {
    private Long usuario; // Debe coincidir con el nombre del campo en UsuarioRol
    private Long rol; // Debe coincidir con el nombre del campo en UsuarioRol

    public UsuarioRolId() {
    }

    public UsuarioRolId(Long usuario, Long rol) {
        this.usuario = usuario;
        this.rol = rol;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getRol() {
        return rol;
    }

    public void setRol(Long rol) {
        this.rol = rol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UsuarioRolId that = (UsuarioRolId) o;
        return Objects.equals(usuario, that.usuario) && Objects.equals(rol, that.rol);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, rol);
    }
}
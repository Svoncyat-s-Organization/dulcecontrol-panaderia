package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioSedeId implements Serializable {
    private Long usuario; // Debe coincidir con el nombre del campo en UsuarioSede
    private Long sede; // Debe coincidir con el nombre del campo en UsuarioSede

    public UsuarioSedeId() {
    }

    public UsuarioSedeId(Long usuario, Long sede) {
        this.usuario = usuario;
        this.sede = sede;
    }

    public Long getUsuario() {
        return usuario;
    }

    public void setUsuario(Long usuario) {
        this.usuario = usuario;
    }

    public Long getSede() {
        return sede;
    }

    public void setSede(Long sede) {
        this.sede = sede;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UsuarioSedeId that = (UsuarioSedeId) o;
        return Objects.equals(usuario, that.usuario) && Objects.equals(sede, that.sede);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuario, sede);
    }
}
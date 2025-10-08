package com.dulcecontrol.bakery.entity;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioSedeId implements Serializable {
    private Long usuarioId;
    private Long sedeId;

    public UsuarioSedeId() {
    }

    public UsuarioSedeId(Long usuarioId, Long sedeId) {
        this.usuarioId = usuarioId;
        this.sedeId = sedeId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public Long getSedeId() {
        return sedeId;
    }

    public void setSedeId(Long sedeId) {
        this.sedeId = sedeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UsuarioSedeId that = (UsuarioSedeId) o;
        return Objects.equals(usuarioId, that.usuarioId) && Objects.equals(sedeId, that.sedeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, sedeId);
    }
}
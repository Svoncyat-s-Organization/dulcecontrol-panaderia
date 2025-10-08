package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario_sede")
@IdClass(UsuarioSedeId.class)
public class UsuarioSede {

    @Id
    private Long usuarioId;

    @Id
    private Long sedeId;

    // --- Getters y Setters ---

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
    public String toString() {
        return "UsuarioSede [usuarioId=" + usuarioId + ", sedeId=" + sedeId + "]";
    }
}
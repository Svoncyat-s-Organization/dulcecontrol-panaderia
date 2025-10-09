package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "rol_permiso", schema = "dulce_control")
@IdClass(RolPermisoId.class)
public class RolPermiso {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "permiso_id", nullable = false)
    private Permiso permiso;

    // --- Getters y Setters ---

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Permiso getPermiso() {
        return permiso;
    }

    public void setPermiso(Permiso permiso) {
        this.permiso = permiso;
    }

    // Métodos de compatibilidad para mantener API existente
    public Long getRolId() {
        return rol != null ? rol.getId() : null;
    }

    public void setRolId(Long rolId) {
        if (this.rol == null) {
            this.rol = new Rol();
        }
        this.rol.setId(rolId);
    }

    public Long getPermisoId() {
        return permiso != null ? permiso.getId() : null;
    }

    public void setPermisoId(Long permisoId) {
        if (this.permiso == null) {
            this.permiso = new Permiso();
        }
        this.permiso.setId(permisoId);
    }

    @Override
    public String toString() {
        return "RolPermiso [rolId=" + getRolId() + ", permisoId=" + getPermisoId() + "]";
    }
}
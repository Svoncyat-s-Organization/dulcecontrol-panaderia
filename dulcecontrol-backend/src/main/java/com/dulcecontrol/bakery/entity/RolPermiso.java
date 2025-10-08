package com.dulcecontrol.bakery.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "rol_permiso")
@IdClass(RolPermisoId.class)
public class RolPermiso {

    @Id
    private Long rolId;

    @Id
    private Long permisoId;

    // --- Getters y Setters ---

    public Long getRolId() {
        return rolId;
    }

    public void setRolId(Long rolId) {
        this.rolId = rolId;
    }

    public Long getPermisoId() {
        return permisoId;
    }

    public void setPermisoId(Long permisoId) {
        this.permisoId = permisoId;
    }

    @Override
    public String toString() {
        return "RolPermiso [rolId=" + rolId + ", permisoId=" + permisoId + "]";
    }
}
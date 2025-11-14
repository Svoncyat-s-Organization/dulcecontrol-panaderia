package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class RolPermisoId implements Serializable {

    @Column(name = "rol_id")
    private Long rolId;

    @Column(name = "permiso_id")
    private Long permisoId;
}

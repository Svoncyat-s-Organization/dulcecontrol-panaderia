package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "roles_permisos")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class RolPermiso {

    @EmbeddedId
    @EqualsAndHashCode.Include
    private RolPermisoId id = new RolPermisoId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("rolId")
    @JoinColumn(name = "rol_id")
    @ToString.Exclude
    private Rol rol;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("permisoId")
    @JoinColumn(name = "permiso_id")
    @ToString.Exclude
    private Permiso permiso;
}

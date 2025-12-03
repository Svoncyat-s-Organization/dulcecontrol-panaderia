package com.dulcecontrol.bakery.features.superadmin.seguridad.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "permisos_superadmin")
@Getter
@Setter
public class PermisoSuperadmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "nombre_visible", nullable = false)
    private String nombreVisible;

    @Column(nullable = false)
    private String modulo;
}

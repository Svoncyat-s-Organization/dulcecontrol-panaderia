package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "permisos")
@Data
public class Permiso {

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

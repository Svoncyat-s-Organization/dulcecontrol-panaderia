package com.dulcecontrol.bakery.features.admin.ubigeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ubigeo_departamentos")
@Getter
@Setter
public class UbigeoDepartamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_ubigeo", nullable = false, length = 2, unique = true)
    private String codigoUbigeo;
}

package com.dulcecontrol.bakery.features.admin.ubigeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ubigeo_distritos")
@Getter
@Setter
public class UbigeoDistrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provincia_id", nullable = false)
    private Long provinciaId;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_ubigeo", nullable = false, length = 6, unique = true)
    private String codigoUbigeo;
}

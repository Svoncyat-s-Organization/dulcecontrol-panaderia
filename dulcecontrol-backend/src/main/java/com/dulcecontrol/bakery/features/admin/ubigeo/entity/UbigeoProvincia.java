package com.dulcecontrol.bakery.features.admin.ubigeo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ubigeo_provincias")
@Getter
@Setter
public class UbigeoProvincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "departamento_id", nullable = false)
    private Long departamentoId;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_ubigeo", nullable = false, length = 4, unique = true)
    private String codigoUbigeo;
}

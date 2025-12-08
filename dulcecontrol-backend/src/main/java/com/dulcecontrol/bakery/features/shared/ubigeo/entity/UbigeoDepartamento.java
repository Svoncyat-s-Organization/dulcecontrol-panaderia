package com.dulcecontrol.bakery.features.shared.ubigeo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ubigeo_departamentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbigeoDepartamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_ubigeo", nullable = false, length = 2, unique = true)
    private String codigoUbigeo;
}

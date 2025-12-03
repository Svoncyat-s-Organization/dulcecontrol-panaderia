package com.dulcecontrol.bakery.features.shared.ubigeo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ubigeo_provincias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UbigeoProvincia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "departamento_id", nullable = false)
    private UbigeoDepartamento departamento;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "codigo_ubigeo", nullable = false, length = 4, unique = true)
    private String codigoUbigeo;
}

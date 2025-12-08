package com.dulcecontrol.bakery.features.superadmin.facturacion.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "metodos_pago")
public class MetodoPago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String codigo;

    @Column(nullable = false)
    private Boolean activo = true;
}

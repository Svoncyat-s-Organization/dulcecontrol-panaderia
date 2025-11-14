package com.dulcecontrol.bakery.features.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "roles")
@Data
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "es_sistema")
    private Boolean esSistema = Boolean.FALSE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
        if (esSistema == null) {
            esSistema = Boolean.FALSE;
        }
    }
}

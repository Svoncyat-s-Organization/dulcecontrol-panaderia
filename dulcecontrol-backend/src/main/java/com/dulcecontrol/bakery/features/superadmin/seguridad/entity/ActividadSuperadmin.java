package com.dulcecontrol.bakery.features.superadmin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "actividad_superadmin")
@Getter
@Setter
public class ActividadSuperadmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private UsuarioSuperadmin superadmin;

    @Column(name = "tipo_evento", nullable = false, length = 100)
    private String tipoEvento;

    @Column(name = "ip_origen", length = 45)
    private String ipOrigen;

    @Column(name = "detalles", columnDefinition = "JSON")
    private String detallesJson;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}

package com.dulcecontrol.bakery.security.token.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "desarrollador_token")
@SQLDelete(sql = "UPDATE desarrollador_token SET eliminado_en = NOW(), activo = false WHERE id = ?")
@SQLRestriction("eliminado_en IS NULL")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DesarrolladorToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_completo", nullable = false, unique = true)
    private String nombreCompleto;

    @Column(name = "correo", nullable = false, unique = true)
    private String correo;

    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
    }
}

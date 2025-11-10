package com.dulcecontrol.bakery.feature.admin.seguridad.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios_tienda")
@SQLDelete(sql = "UPDATE usuarios_tienda SET activo = false, eliminado_en = NOW() WHERE id = ?")
@SQLRestriction("activo = true")
@Data
public class UsuarioTienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "rol_id", nullable = false)
    private Long rolId;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_doc", nullable = false, columnDefinition = "ENUM('DNI','RUC')")
    private TipoDocumento tipoDoc;

    @Column(name = "numero_doc", nullable = false, length = 20)
    private String numeroDoc;

    @Column(name = "nombres_doc", nullable = false)
    private String nombres;

    @Column(length = 50)
    private String telefono;

    private Boolean activo = true;

    @Column(name = "ultimo_acceso_en")
    private LocalDateTime ultimoAccesoEn;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (activo == null)
            activo = true;
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
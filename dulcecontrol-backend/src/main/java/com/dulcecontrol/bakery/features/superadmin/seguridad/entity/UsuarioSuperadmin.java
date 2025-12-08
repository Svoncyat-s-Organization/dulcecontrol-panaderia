package com.dulcecontrol.bakery.features.superadmin.seguridad.entity;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.enums.TipoDocumento;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios_superadmin")
@SQLDelete(sql = "UPDATE usuarios_superadmin SET activo = false, eliminado_en = NOW() WHERE id = ?")
@SQLRestriction("eliminado_en IS NULL")
@Getter
@Setter
public class UsuarioSuperadmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String correo;

    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_doc", nullable = false, columnDefinition = "ENUM('DNI','RUC')")
    private TipoDocumento tipoDoc;

    @Column(name = "numero_doc", length = 20)
    private String numeroDoc;

    @Column(name = "nombres_doc")
    private String nombres;

    @Column(length = 50)
    private String telefono;

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

        @ManyToMany(fetch = FetchType.LAZY)
        @JoinTable(
            name = "usuarios_superadmin_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "rol_id")
        )
        private Set<RolSuperadmin> roles = new HashSet<>();

    @PrePersist
    void onCreate() {
        LocalDateTime ahora = LocalDateTime.now();
        creadoEn = ahora;
        actualizadoEn = ahora;
        if (activo == null) {
            activo = Boolean.TRUE;
        }
        if (roles == null) {
            roles = new HashSet<>();
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

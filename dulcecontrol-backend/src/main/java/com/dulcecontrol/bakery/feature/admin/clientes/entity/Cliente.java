package com.dulcecontrol.bakery.feature.admin.clientes.entity;

import com.dulcecontrol.bakery.feature.admin.clientes.entity.enums.TipoDocumento;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "clientes", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "tienda_id", "tipo_doc", "numero_doc" }),
        @UniqueConstraint(columnNames = { "tienda_id", "email" })
})
@SQLDelete(sql = "UPDATE clientes SET activo = false WHERE id = ?")
@SQLRestriction("activo = true")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "tipo_doc", columnDefinition = "ENUM('DNI', 'RUC')")
    private TipoDocumento tipoDoc;

    @Column(name = "numero_doc", length = 20)
    private String numeroDoc;

    @Column(name = "nombre_doc", nullable = false)
    private String nombreDoc;

    @Column(length = 255)
    private String email;

    @Column(length = 50)
    private String telefono;

    @Column(name = "es_usuario_virtual", nullable = false)
    private Boolean esUsuarioVirtual = false;

    @Column(name = "hash_contrasena")
    private String hashContrasena;

    @Column(columnDefinition = "TEXT")
    private String notas;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (activo == null) {
            activo = true;
        }
        if (esUsuarioVirtual == null) {
            esUsuarioVirtual = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
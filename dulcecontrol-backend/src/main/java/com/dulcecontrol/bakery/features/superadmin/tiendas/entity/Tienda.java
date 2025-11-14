package com.dulcecontrol.bakery.features.superadmin.tiendas.entity;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.EstadoTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDocumentoTienda;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "tiendas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE tiendas SET eliminado_en = NOW() WHERE id = ?")
@SQLRestriction("eliminado_en IS NULL")
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_doc", nullable = false, length = 3)
    private TipoDocumentoTienda tipoDoc;

    @Column(name = "numero_doc", nullable = false, unique = true, length = 20)
    private String numeroDoc;

    @Column(name = "nombre_doc", nullable = false)
    private String nombreDoc;

    @Column(name = "nombre_comercial")
    private String nombreComercial;

    @Column(name = "correo_contacto", nullable = false)
    private String correoContacto;

    @Column(name = "telefono_contacto")
    private String telefonoContacto;

    @Column(name = "hash_contrasena", nullable = false)
    private String hashContrasena;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoTienda estado;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        creadoEn = now;
        actualizadoEn = now;
        if (estado == null) {
            estado = EstadoTienda.EN_PRUEBA;
        }
    }

    @PreUpdate
    void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}

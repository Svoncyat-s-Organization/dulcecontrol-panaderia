package com.dulcecontrol.bakery.features.admin.configuracion.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "paginas_storefront", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tienda_id", "slug"})
})
@SQLDelete(sql = "UPDATE paginas_storefront SET activa = false WHERE id = ?")
@SQLRestriction("activa = true")
@Data
public class PaginaStorefront {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(length = 100, nullable = false)
    private String slug;

    @Column(length = 255, nullable = false)
    private String titulo;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String contenido;

    @Column(name = "meta_descripcion", columnDefinition = "TEXT")
    private String metaDescripcion;

    @Column(name = "orden_menu")
    private Integer ordenMenu = 0;

    @Column(name = "visible_en_menu", nullable = false)
    private Boolean visibleEnMenu = true;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    protected void onCreate() {
        creadoEn = LocalDateTime.now();
        actualizadoEn = LocalDateTime.now();
        if (ordenMenu == null) {
            ordenMenu = 0;
        }
        if (visibleEnMenu == null) {
            visibleEnMenu = true;
        }
        if (activa == null) {
            activa = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        actualizadoEn = LocalDateTime.now();
    }
}
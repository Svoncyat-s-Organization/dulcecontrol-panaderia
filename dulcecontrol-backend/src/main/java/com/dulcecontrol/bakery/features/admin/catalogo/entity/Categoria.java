package com.dulcecontrol.bakery.features.admin.catalogo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "categorias", uniqueConstraints = {
        @UniqueConstraint(name = "uk_categorias_tienda_nombre", columnNames = {"tienda_id", "nombre"}),
        @UniqueConstraint(name = "uk_categorias_tienda_slug", columnNames = {"tienda_id", "slug"})
})
@SQLDelete(sql = "UPDATE categorias SET activa = false WHERE id = ?")
@SQLRestriction("activa = true")
@Getter
@Setter
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "url_imagen", columnDefinition = "TEXT")
    private String urlImagen;

    @Column(length = 100)
    private String icono;

    @Column(nullable = false)
    private Boolean activa = Boolean.TRUE;

    @Column(name = "orden_visual")
    private Integer ordenVisual = 0;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @PrePersist
    void onCreate() {
        if (activa == null) {
            activa = Boolean.TRUE;
        }
        if (ordenVisual == null) {
            ordenVisual = 0;
        }
        creadoEn = LocalDateTime.now();
    }
}

package com.dulcecontrol.bakery.features.shared.catalogo.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad Categoria - Representa las categorías de productos del catálogo.
 * Tabla: categorias
 */
@Entity
@Table(name = "categorias", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tienda_id", "nombre"}),
    @UniqueConstraint(columnNames = {"tienda_id", "slug"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "url_imagen")
    private String urlImagen;

    @Column(length = 50)
    private String icono;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "orden_visual")
    private Integer ordenVisual = 0;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
}

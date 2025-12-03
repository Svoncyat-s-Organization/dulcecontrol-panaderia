package com.dulcecontrol.bakery.features.shared.catalogo.model;

import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Entidad Producto - Representa productos del catálogo.
 * Tabla: productos
 */
@Entity
@Table(name = "productos", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"tienda_id", "sku"}),
    @UniqueConstraint(columnNames = {"tienda_id", "slug"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "categoria_id")
    private Long categoriaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", insertable = false, updatable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoProducto tipo = TipoProducto.PRODUCTO_TERMINADO;

    @Column(name = "es_personalizable", nullable = false)
    private Boolean esPersonalizable = false;

    @Column(name = "precio_base_centimos", nullable = false)
    private Long precioBaseCentimos = 0L;

    @Column(name = "precio_oferta_centimos")
    private Long precioOfertaCentimos;

    @Column(name = "visible_en_pos", nullable = false)
    private Boolean visibleEnPos = true;

    @Column(name = "visible_en_storefront", nullable = false)
    private Boolean visibleEnStorefront = true;

    @Column(name = "destacado_storefront", nullable = false)
    private Boolean destacadoStorefront = false;

    @Column(name = "url_imagen_principal")
    private String urlImagenPrincipal;

    @Type(JsonType.class)
    @Column(name = "imagenes_galeria", columnDefinition = "jsonb")
    private List<String> imagenesGaleria;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> atributos;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    public enum TipoProducto {
        PRODUCTO_TERMINADO,
        SEMI_ELABORADO,
        INSUMO,
        SERVICIO
    }
}

package com.dulcecontrol.bakery.features.admin.catalogo.entity;

import com.dulcecontrol.bakery.features.admin.catalogo.entity.enums.TipoProducto;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "productos", uniqueConstraints = {
        @UniqueConstraint(name = "uk_productos_tienda_sku", columnNames = {"tienda_id", "sku"}),
        @UniqueConstraint(name = "uk_productos_tienda_slug", columnNames = {"tienda_id", "slug"})
})
@SQLDelete(sql = "UPDATE productos SET activo = false, actualizado_en = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("activo = true")
@Getter
@Setter
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tienda_id", nullable = false)
    private Long tiendaId;

    @Column(name = "categoria_id")
    private Long categoriaId;

    @Column(nullable = false, length = 255)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String slug;

    @Column(nullable = false, length = 100)
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false, columnDefinition = "ENUM('producto_terminado','insumo_venta','servicio')")
    private TipoProducto tipo = TipoProducto.PRODUCTO_TERMINADO;

    @Column(name = "es_personalizable", nullable = false)
    private Boolean esPersonalizable = Boolean.FALSE;

    @Column(name = "precio_base_centimos", nullable = false)
    private Long precioBaseCentimos = 0L;

    @Column(name = "precio_oferta_centimos")
    private Long precioOfertaCentimos;

    @Column(name = "visible_en_pos", nullable = false)
    private Boolean visibleEnPos = Boolean.TRUE;

    @Column(name = "visible_en_storefront", nullable = false)
    private Boolean visibleEnStorefront = Boolean.TRUE;

    @Column(name = "destacado_storefront", nullable = false)
    private Boolean destacadoStorefront = Boolean.FALSE;

    @Column(name = "url_imagen_principal", columnDefinition = "TEXT")
    private String urlImagenPrincipal;

    @Type(JsonType.class)
    @Column(name = "imagenes_galeria", columnDefinition = "json")
    private List<String> imagenesGaleria = new ArrayList<>();

    @Type(JsonType.class)
    @Column(name = "atributos", columnDefinition = "json")
    private Map<String, Object> atributos = new HashMap<>();

    @Column(nullable = false)
    private Boolean activo = Boolean.TRUE;

    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @PrePersist
    void onCreate() {
        if (tipo == null) {
            tipo = TipoProducto.PRODUCTO_TERMINADO;
        }
        if (esPersonalizable == null) {
            esPersonalizable = Boolean.FALSE;
        }
        if (visibleEnPos == null) {
            visibleEnPos = Boolean.TRUE;
        }
        if (visibleEnStorefront == null) {
            visibleEnStorefront = Boolean.TRUE;
        }
        if (destacadoStorefront == null) {
            destacadoStorefront = Boolean.FALSE;
        }
        if (activo == null) {
            activo = Boolean.TRUE;
        }
        if (precioBaseCentimos == null) {
            precioBaseCentimos = 0L;
        }
        if (imagenesGaleria == null) {
            imagenesGaleria = new ArrayList<>();
        }
        if (atributos == null) {
            atributos = new HashMap<>();
        }
        creadoEn = LocalDateTime.now();
        actualizadoEn = creadoEn;
    }

    @PreUpdate
    void onUpdate() {
        if (imagenesGaleria == null) {
            imagenesGaleria = new ArrayList<>();
        }
        if (atributos == null) {
            atributos = new HashMap<>();
        }
        actualizadoEn = LocalDateTime.now();
    }
}

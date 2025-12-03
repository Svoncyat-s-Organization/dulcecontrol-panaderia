package com.dulcecontrol.bakery.features.shared.catalogo.repository;

import com.dulcecontrol.bakery.features.admin.catalogo.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio unificado para Producto.
 * Incluye queries para catálogo público Y gestión admin.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // ========== QUERIES PÚBLICAS (Storefront) ==========
    
    /**
     * Busca productos visibles en storefront con filtros opcionales.
     * Filtros: categoría, destacado.
     * Usado en HomePage (destacados) y ProductsPage (listado).
     */
    @Query("SELECT p FROM Producto p " +
           "LEFT JOIN FETCH p.categoria " +
           "WHERE p.tiendaId = :tiendaId " +
           "AND p.activo = true " +
           "AND p.visibleEnStorefront = true " +
           "AND (:categoriaId IS NULL OR p.categoriaId = :categoriaId) " +
           "AND (:destacado IS NULL OR p.destacadoStorefront = :destacado)")
    Page<Producto> buscarProductosPublicos(
        @Param("tiendaId") Long tiendaId,
        @Param("categoriaId") Long categoriaId,
        @Param("destacado") Boolean destacado,
        Pageable pageable
    );

    /**
     * Busca un producto por tienda y slug.
     * Usado en ProductDetailPage.
     */
    @Query("SELECT p FROM Producto p " +
           "LEFT JOIN FETCH p.categoria " +
           "WHERE p.tiendaId = :tiendaId " +
           "AND p.slug = :slug " +
           "AND p.activo = true " +
           "AND p.visibleEnStorefront = true")
    Optional<Producto> findByTiendaIdAndSlugForStorefront(
        @Param("tiendaId") Long tiendaId,
        @Param("slug") String slug
    );

    // ========== QUERIES ADMIN (Backoffice) ==========
    
    /**
     * Busca productos por tienda (admin - incluye inactivos).
     */
    Page<Producto> findByTiendaId(Long tiendaId, Pageable pageable);

    /**
     * Busca productos por tienda ordenados por nombre.
     */
    List<Producto> findByTiendaIdOrderByNombreAsc(Long tiendaId);

    /**
     * Busca productos por tienda y categoría.
     */
    List<Producto> findByTiendaIdAndCategoriaIdOrderByNombreAsc(Long tiendaId, Long categoriaId);

    /**
     * Busca un producto por ID y tienda.
     */
    Optional<Producto> findByIdAndTiendaId(Long id, Long tiendaId);

    /**
     * Verifica si existe un producto con el SKU dado en la tienda.
     */
    boolean existsByTiendaIdAndSkuIgnoreCase(Long tiendaId, String sku);

    /**
     * Verifica si existe un producto con el slug dado en la tienda.
     */
    boolean existsByTiendaIdAndSlugIgnoreCase(Long tiendaId, String slug);

    /**
     * Verifica si existe un producto con el SKU dado, excluyendo un ID específico.
     */
    boolean existsByTiendaIdAndSkuIgnoreCaseAndIdNot(Long tiendaId, String sku, Long id);

    /**
     * Verifica si existe un producto con el slug dado, excluyendo un ID específico.
     */
    boolean existsByTiendaIdAndSlugIgnoreCaseAndIdNot(Long tiendaId, String slug, Long id);

    /**
     * Cuenta productos por categoría.
     */
    long countByCategoriaId(Long categoriaId);
}

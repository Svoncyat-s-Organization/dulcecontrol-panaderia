package com.dulcecontrol.bakery.features.shared.catalogo.repository;

import com.dulcecontrol.bakery.features.shared.catalogo.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para Producto.
 * Incluye queries filtradas para el catálogo público.
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

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

    /**
     * Busca productos por tienda (admin - incluye inactivos).
     */
    Page<Producto> findByTiendaId(Long tiendaId, Pageable pageable);
}

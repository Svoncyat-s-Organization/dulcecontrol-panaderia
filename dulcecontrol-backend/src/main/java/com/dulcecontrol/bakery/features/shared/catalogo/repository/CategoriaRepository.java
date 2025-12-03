package com.dulcecontrol.bakery.features.shared.catalogo.repository;

import com.dulcecontrol.bakery.features.admin.catalogo.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio unificado para Categoria.
 * Incluye queries para catálogo público Y gestión admin.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // ========== QUERIES PÚBLICAS (Storefront) ==========
    
    /**
     * Busca categorías activas de una tienda, ordenadas por orden_visual.
     * Usado en el storefront para el carrusel de categorías.
     */
    @Query("SELECT c FROM Categoria c " +
           "WHERE c.tiendaId = :tiendaId " +
           "AND c.activa = true " +
           "ORDER BY c.ordenVisual ASC, c.nombre ASC")
    List<Categoria> findCategoriasActivasByTiendaId(@Param("tiendaId") Long tiendaId);

    /**
     * Busca una categoría por tienda y slug.
     * Usado en CategoryPage para obtener datos por URL.
     */
    Optional<Categoria> findByTiendaIdAndSlugAndActivaTrue(Long tiendaId, String slug);

    // ========== QUERIES ADMIN (Backoffice) ==========
    
    /**
     * Busca todas las categorías de una tienda ordenadas (incluye inactivas).
     */
    List<Categoria> findByTiendaIdOrderByOrdenVisualAscNombreAsc(Long tiendaId);

    /**
     * Busca una categoría por ID y tienda.
     */
    Optional<Categoria> findByIdAndTiendaId(Long id, Long tiendaId);

    /**
     * Verifica si existe una categoría con el nombre dado en la tienda.
     */
    boolean existsByTiendaIdAndNombreIgnoreCase(Long tiendaId, String nombre);

    /**
     * Verifica si existe una categoría con el slug dado en la tienda.
     */
    boolean existsByTiendaIdAndSlugIgnoreCase(Long tiendaId, String slug);

    /**
     * Verifica si existe una categoría con el nombre dado, excluyendo un ID específico.
     */
    boolean existsByTiendaIdAndNombreIgnoreCaseAndIdNot(Long tiendaId, String nombre, Long id);

    /**
     * Verifica si existe una categoría con el slug dado, excluyendo un ID específico.
     */
    boolean existsByTiendaIdAndSlugIgnoreCaseAndIdNot(Long tiendaId, String slug, Long id);
}

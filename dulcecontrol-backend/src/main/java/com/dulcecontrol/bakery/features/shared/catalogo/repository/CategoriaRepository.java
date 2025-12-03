package com.dulcecontrol.bakery.features.shared.catalogo.repository;

import com.dulcecontrol.bakery.features.shared.catalogo.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para Categoria.
 * Incluye queries para el catálogo público del storefront.
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

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

    /**
     * Busca todas las categorías de una tienda (incluye inactivas).
     * Usado en el admin para gestión.
     */
    List<Categoria> findByTiendaIdOrderByOrdenVisualAsc(Long tiendaId);
}

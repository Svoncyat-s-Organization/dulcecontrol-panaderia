package com.dulcecontrol.bakery.features.admin.configuracion.repository;

import com.dulcecontrol.bakery.features.admin.configuracion.entity.PaginaStorefront;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaginaStorefrontRepository extends JpaRepository<PaginaStorefront, Long> {

    List<PaginaStorefront> findByTiendaId(Long tiendaId);

    List<PaginaStorefront> findByTiendaIdAndVisibleEnMenuOrderByOrdenMenu(Long tiendaId, Boolean visibleEnMenu);

    Optional<PaginaStorefront> findByIdAndTiendaId(Long id, Long tiendaId);

    Optional<PaginaStorefront> findByTiendaIdAndSlug(Long tiendaId, String slug);

    boolean existsByTiendaIdAndSlug(Long tiendaId, String slug);

    boolean existsByTiendaIdAndSlugAndIdNot(Long tiendaId, String slug, Long id);

    @Query("SELECT p FROM PaginaStorefront p WHERE p.tiendaId = :tiendaId AND p.activa = true AND " +
           "(p.titulo LIKE %:busqueda% OR p.slug LIKE %:busqueda% OR p.contenido LIKE %:busqueda%)")
    List<PaginaStorefront> buscarPorTiendaYTexto(@Param("tiendaId") Long tiendaId, @Param("busqueda") String busqueda);
}
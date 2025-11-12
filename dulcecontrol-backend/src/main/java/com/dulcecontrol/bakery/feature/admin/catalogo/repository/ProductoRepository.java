package com.dulcecontrol.bakery.feature.admin.catalogo.repository;

import com.dulcecontrol.bakery.feature.admin.catalogo.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByTiendaIdOrderByNombreAsc(Long tiendaId);

    List<Producto> findByTiendaIdAndCategoriaIdOrderByNombreAsc(Long tiendaId, Long categoriaId);

    Optional<Producto> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndSkuIgnoreCase(Long tiendaId, String sku);

    boolean existsByTiendaIdAndSlugIgnoreCase(Long tiendaId, String slug);

    boolean existsByTiendaIdAndSkuIgnoreCaseAndIdNot(Long tiendaId, String sku, Long id);

    boolean existsByTiendaIdAndSlugIgnoreCaseAndIdNot(Long tiendaId, String slug, Long id);
}

package com.dulcecontrol.bakery.feature.admin.produccion.repository;

import com.dulcecontrol.bakery.feature.admin.produccion.entity.Receta;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecetaRepository extends JpaRepository<Receta, Long> {

    List<Receta> findByTiendaId(Long tiendaId);

    Optional<Receta> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndProductoIdAndInsumoId(Long tiendaId, Long productoId, Long insumoId);

    boolean existsByTiendaIdAndProductoIdAndInsumoIdAndIdNot(Long tiendaId, Long productoId, Long insumoId, Long id);
}

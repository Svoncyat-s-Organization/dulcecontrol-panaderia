package com.dulcecontrol.bakery.features.admin.produccion.repository;

import com.dulcecontrol.bakery.features.admin.produccion.entity.StockIdeal;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockIdealRepository extends JpaRepository<StockIdeal, Long> {

    List<StockIdeal> findByTiendaId(Long tiendaId);

    List<StockIdeal> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

    Optional<StockIdeal> findByIdAndTiendaId(Long id, Long tiendaId);
    
    Optional<StockIdeal> findByTiendaIdAndSedeIdAndProductoId(Long tiendaId, Long sedeId, Long productoId);

    boolean existsByTiendaIdAndSedeIdAndProductoId(Long tiendaId, Long sedeId, Long productoId);

    boolean existsByTiendaIdAndSedeIdAndProductoIdAndIdNot(Long tiendaId, Long sedeId, Long productoId, Long id);
}

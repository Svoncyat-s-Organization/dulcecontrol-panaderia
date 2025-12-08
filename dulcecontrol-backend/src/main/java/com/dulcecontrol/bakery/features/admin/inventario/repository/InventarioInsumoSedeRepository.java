package com.dulcecontrol.bakery.features.admin.inventario.repository;

import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioInsumoSede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioInsumoSedeRepository extends JpaRepository<InventarioInsumoSede, Long> {

    List<InventarioInsumoSede> findByTiendaId(Long tiendaId);

    List<InventarioInsumoSede> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

    @Query("SELECT iis FROM InventarioInsumoSede iis WHERE iis.tiendaId = :tiendaId AND iis.sedeId = :sedeId ORDER BY iis.id")
    List<InventarioInsumoSede> findEnrichedByTiendaIdAndSedeId(@Param("tiendaId") Long tiendaId, @Param("sedeId") Long sedeId);

    Optional<InventarioInsumoSede> findByIdAndTiendaId(Long id, Long tiendaId);

    Optional<InventarioInsumoSede> findBySedeIdAndInsumoId(Long sedeId, Long insumoId);

    @Query("SELECT i FROM InventarioInsumoSede i WHERE i.tiendaId = :tiendaId AND i.sedeId = :sedeId AND i.cantidadActual < :cantidadMinima")
    List<InventarioInsumoSede> findBajoStock(@Param("tiendaId") Long tiendaId,
            @Param("sedeId") Long sedeId,
            @Param("cantidadMinima") BigDecimal cantidadMinima);

    boolean existsBySedeIdAndInsumoId(Long sedeId, Long insumoId);
}

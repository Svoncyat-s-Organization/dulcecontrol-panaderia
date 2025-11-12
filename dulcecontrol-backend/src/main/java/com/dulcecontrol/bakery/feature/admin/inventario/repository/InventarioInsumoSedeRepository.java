package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioInsumoSede;
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

    List<InventarioInsumoSede> findBySedeId(Long sedeId);

    Optional<InventarioInsumoSede> findBySedeIdAndInsumoId(Long sedeId, Long insumoId);

    List<InventarioInsumoSede> findByTiendaIdAndCantidadActualLessThan(Long tiendaId, BigDecimal cantidad);

    @Query("SELECT i FROM InventarioInsumoSede i WHERE i.tiendaId = :tiendaId AND i.sedeId = :sedeId")
    List<InventarioInsumoSede> findByTiendaIdAndSedeId(@Param("tiendaId") Long tiendaId, @Param("sedeId") Long sedeId);

    @Query("SELECT i FROM InventarioInsumoSede i WHERE i.sedeId = :sedeId AND i.cantidadActual < :cantidadMinima")
    List<InventarioInsumoSede> findInventarioBajo(@Param("sedeId") Long sedeId,
            @Param("cantidadMinima") BigDecimal cantidadMinima);
}

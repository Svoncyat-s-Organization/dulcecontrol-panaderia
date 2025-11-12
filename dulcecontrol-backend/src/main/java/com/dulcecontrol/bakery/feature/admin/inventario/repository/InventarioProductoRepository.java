package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.InventarioProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioProductoRepository extends JpaRepository<InventarioProducto, Long> {

    List<InventarioProducto> findByTiendaId(Long tiendaId);

    List<InventarioProducto> findBySedeId(Long sedeId);

    Optional<InventarioProducto> findBySedeIdAndProductoId(Long sedeId, Long productoId);

    List<InventarioProducto> findByTiendaIdAndCantidadActualLessThan(Long tiendaId, Integer cantidad);

    @Query("SELECT i FROM InventarioProducto i WHERE i.tiendaId = :tiendaId AND i.sedeId = :sedeId")
    List<InventarioProducto> findByTiendaIdAndSedeId(@Param("tiendaId") Long tiendaId, @Param("sedeId") Long sedeId);

    @Query("SELECT i FROM InventarioProducto i WHERE i.sedeId = :sedeId AND i.cantidadActual < :cantidadMinima")
    List<InventarioProducto> findInventarioBajo(@Param("sedeId") Long sedeId,
            @Param("cantidadMinima") Integer cantidadMinima);

    @Query("SELECT i FROM InventarioProducto i WHERE i.sedeId = :sedeId AND i.cantidadActual = 0")
    List<InventarioProducto> findProductosAgotados(@Param("sedeId") Long sedeId);
}

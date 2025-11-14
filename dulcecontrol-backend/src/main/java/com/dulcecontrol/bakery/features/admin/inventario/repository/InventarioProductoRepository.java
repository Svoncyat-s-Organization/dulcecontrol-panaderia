package com.dulcecontrol.bakery.features.admin.inventario.repository;

import com.dulcecontrol.bakery.features.admin.inventario.entity.InventarioProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioProductoRepository extends JpaRepository<InventarioProducto, Long> {

    List<InventarioProducto> findByTiendaId(Long tiendaId);

    List<InventarioProducto> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

    Optional<InventarioProducto> findByIdAndTiendaId(Long id, Long tiendaId);

    Optional<InventarioProducto> findBySedeIdAndProductoId(Long sedeId, Long productoId);

    @Query("SELECT i FROM InventarioProducto i WHERE i.tiendaId = :tiendaId AND i.sedeId = :sedeId AND i.cantidadActual < :cantidadMinima")
    List<InventarioProducto> findBajoStock(@Param("tiendaId") Long tiendaId,
            @Param("sedeId") Long sedeId,
            @Param("cantidadMinima") Integer cantidadMinima);

    boolean existsBySedeIdAndProductoId(Long sedeId, Long productoId);
}

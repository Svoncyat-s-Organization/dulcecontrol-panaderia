package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoInventarioProductoRepository extends JpaRepository<MovimientoInventarioProducto, Long> {

    List<MovimientoInventarioProducto> findByTiendaId(Long tiendaId);

    List<MovimientoInventarioProducto> findBySedeId(Long sedeId);

    List<MovimientoInventarioProducto> findByProductoId(Long productoId);

    @Query("SELECT m FROM MovimientoInventarioProducto m WHERE m.sedeId = :sedeId AND m.productoId = :productoId ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioProducto> findBySedeIdAndProductoIdOrderByCreadoEnDesc(@Param("sedeId") Long sedeId,
            @Param("productoId") Long productoId);

    @Query("SELECT m FROM MovimientoInventarioProducto m WHERE m.tiendaId = :tiendaId AND m.motivo = :motivo ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioProducto> findByTiendaIdAndMotivo(@Param("tiendaId") Long tiendaId,
            @Param("motivo") MotivoMovimientoProducto motivo);

    @Query("SELECT m FROM MovimientoInventarioProducto m WHERE m.creadoEn BETWEEN :fechaInicio AND :fechaFin ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioProducto> findByFechaRango(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    List<MovimientoInventarioProducto> findByPedidoId(Long pedidoId);

    List<MovimientoInventarioProducto> findByPlanProduccionId(Long planProduccionId);
}

package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoInventarioInsumoRepository extends JpaRepository<MovimientoInventarioInsumo, Long> {

    List<MovimientoInventarioInsumo> findByTiendaId(Long tiendaId);

    List<MovimientoInventarioInsumo> findBySedeId(Long sedeId);

    List<MovimientoInventarioInsumo> findByInsumoId(Long insumoId);

    @Query("SELECT m FROM MovimientoInventarioInsumo m WHERE m.sedeId = :sedeId AND m.insumoId = :insumoId ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioInsumo> findBySedeIdAndInsumoIdOrderByCreadoEnDesc(@Param("sedeId") Long sedeId,
            @Param("insumoId") Long insumoId);

    @Query("SELECT m FROM MovimientoInventarioInsumo m WHERE m.tiendaId = :tiendaId AND m.tipoMovimiento = :tipoMovimiento ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioInsumo> findByTiendaIdAndTipoMovimiento(@Param("tiendaId") Long tiendaId,
            @Param("tipoMovimiento") TipoMovimientoInsumo tipoMovimiento);

    @Query("SELECT m FROM MovimientoInventarioInsumo m WHERE m.creadoEn BETWEEN :fechaInicio AND :fechaFin ORDER BY m.creadoEn DESC")
    List<MovimientoInventarioInsumo> findByFechaRango(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);

    List<MovimientoInventarioInsumo> findByOrdenCompraId(Long ordenCompraId);

    List<MovimientoInventarioInsumo> findByPlanProduccionId(Long planProduccionId);

    List<MovimientoInventarioInsumo> findByTransferenciaId(Long transferenciaId);
}

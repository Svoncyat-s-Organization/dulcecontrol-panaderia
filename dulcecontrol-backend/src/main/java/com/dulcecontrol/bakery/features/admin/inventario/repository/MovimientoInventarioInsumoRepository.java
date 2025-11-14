package com.dulcecontrol.bakery.features.admin.inventario.repository;

import com.dulcecontrol.bakery.features.admin.inventario.entity.MovimientoInventarioInsumo;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.TipoMovimientoInsumo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovimientoInventarioInsumoRepository extends JpaRepository<MovimientoInventarioInsumo, Long> {

    List<MovimientoInventarioInsumo> findByTiendaId(Long tiendaId);

    Optional<MovimientoInventarioInsumo> findByIdAndTiendaId(Long id, Long tiendaId);

    List<MovimientoInventarioInsumo> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioInsumo> findByTiendaIdAndSedeIdOrderByCreadoEnDesc(Long tiendaId, Long sedeId,
            Pageable pageable);

    List<MovimientoInventarioInsumo> findByTiendaIdAndSedeIdAndInsumoId(Long tiendaId, Long sedeId, Long insumoId);

    List<MovimientoInventarioInsumo> findByTiendaIdAndTipoMovimiento(Long tiendaId,
            TipoMovimientoInsumo tipoMovimiento);

    List<MovimientoInventarioInsumo> findByTiendaIdAndCreadoEnBetween(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin);
}

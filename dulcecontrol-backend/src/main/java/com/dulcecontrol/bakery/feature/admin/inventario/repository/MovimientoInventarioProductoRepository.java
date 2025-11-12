package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.MovimientoInventarioProducto;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MovimientoInventarioProductoRepository extends JpaRepository<MovimientoInventarioProducto, Long> {

    List<MovimientoInventarioProducto> findByTiendaId(Long tiendaId);

    Optional<MovimientoInventarioProducto> findByIdAndTiendaId(Long id, Long tiendaId);

    List<MovimientoInventarioProducto> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioProducto> findByTiendaIdAndSedeIdOrderByCreadoEnDesc(Long tiendaId, Long sedeId,
            Pageable pageable);

    List<MovimientoInventarioProducto> findByTiendaIdAndSedeIdAndProductoId(Long tiendaId, Long sedeId,
            Long productoId);

    List<MovimientoInventarioProducto> findByTiendaIdAndMotivo(Long tiendaId, MotivoMovimientoProducto motivo);

    List<MovimientoInventarioProducto> findByTiendaIdAndCreadoEnBetween(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin);
}

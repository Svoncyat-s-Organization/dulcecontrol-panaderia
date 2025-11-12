package com.dulcecontrol.bakery.feature.admin.inventario.repository;

import com.dulcecontrol.bakery.feature.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransferenciaInventarioRepository extends JpaRepository<TransferenciaInventario, Long> {

    List<TransferenciaInventario> findByTiendaId(Long tiendaId);

    List<TransferenciaInventario> findBySedeOrigenId(Long sedeOrigenId);

    List<TransferenciaInventario> findBySedeDestinoId(Long sedeDestinoId);

    List<TransferenciaInventario> findByEstado(EstadoTransferencia estado);

    @Query("SELECT t FROM TransferenciaInventario t WHERE t.sedeOrigenId = :sedeId OR t.sedeDestinoId = :sedeId")
    List<TransferenciaInventario> findBySedeOrigenIdOrSedeDestinoId(@Param("sedeId") Long sedeId);

    @Query("SELECT t FROM TransferenciaInventario t WHERE t.tiendaId = :tiendaId AND t.estado = :estado ORDER BY t.fechaSolicitud DESC")
    List<TransferenciaInventario> findByTiendaIdAndEstado(@Param("tiendaId") Long tiendaId,
            @Param("estado") EstadoTransferencia estado);

    @Query("SELECT t FROM TransferenciaInventario t WHERE t.sedeOrigenId = :sedeOrigenId AND t.estado = :estado ORDER BY t.fechaSolicitud DESC")
    List<TransferenciaInventario> findBySedeOrigenIdAndEstado(@Param("sedeOrigenId") Long sedeOrigenId,
            @Param("estado") EstadoTransferencia estado);

    @Query("SELECT t FROM TransferenciaInventario t WHERE t.sedeDestinoId = :sedeDestinoId AND t.estado = :estado ORDER BY t.fechaSolicitud DESC")
    List<TransferenciaInventario> findBySedeDestinoIdAndEstado(@Param("sedeDestinoId") Long sedeDestinoId,
            @Param("estado") EstadoTransferencia estado);

    @Query("SELECT t FROM TransferenciaInventario t WHERE t.fechaSolicitud BETWEEN :fechaInicio AND :fechaFin ORDER BY t.fechaSolicitud DESC")
    List<TransferenciaInventario> findByFechaSolicitudBetween(@Param("fechaInicio") LocalDateTime fechaInicio,
            @Param("fechaFin") LocalDateTime fechaFin);
}

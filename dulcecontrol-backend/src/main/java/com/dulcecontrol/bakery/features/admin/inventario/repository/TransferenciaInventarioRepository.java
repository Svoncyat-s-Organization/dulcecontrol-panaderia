package com.dulcecontrol.bakery.features.admin.inventario.repository;

import com.dulcecontrol.bakery.features.admin.inventario.entity.TransferenciaInventario;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.EstadoTransferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransferenciaInventarioRepository extends JpaRepository<TransferenciaInventario, Long> {

    List<TransferenciaInventario> findByTiendaId(Long tiendaId);

    Optional<TransferenciaInventario> findByIdAndTiendaId(Long id, Long tiendaId);

    List<TransferenciaInventario> findByTiendaIdAndEstado(Long tiendaId, EstadoTransferencia estado);

    List<TransferenciaInventario> findByTiendaIdAndSedeOrigenId(Long tiendaId, Long sedeOrigenId);

    List<TransferenciaInventario> findByTiendaIdAndSedeDestinoId(Long tiendaId, Long sedeDestinoId);

    List<TransferenciaInventario> findByTiendaIdAndSedeOrigenIdAndEstado(Long tiendaId, Long sedeOrigenId,
            EstadoTransferencia estado);

    List<TransferenciaInventario> findByTiendaIdAndSedeDestinoIdAndEstado(Long tiendaId, Long sedeDestinoId,
            EstadoTransferencia estado);
}

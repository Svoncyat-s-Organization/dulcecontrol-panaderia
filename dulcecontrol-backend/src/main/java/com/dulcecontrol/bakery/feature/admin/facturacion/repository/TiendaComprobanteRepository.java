package com.dulcecontrol.bakery.feature.admin.facturacion.repository;

import com.dulcecontrol.bakery.feature.admin.facturacion.entity.TiendaComprobante;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TiendaComprobanteRepository extends JpaRepository<TiendaComprobante, Long> {

    List<TiendaComprobante> findByTiendaId(Long tiendaId);

    Optional<TiendaComprobante> findByPedidoId(Long pedidoId);

    List<TiendaComprobante> findBySerieId(Long serieId);

    List<TiendaComprobante> findByEstadoSunat(EstadoSunat estadoSunat);

    List<TiendaComprobante> findByTiendaIdAndEstadoSunat(Long tiendaId, EstadoSunat estadoSunat);

    List<TiendaComprobante> findByTiendaIdAndTipoComprobante(Long tiendaId, TipoComprobante tipoComprobante);

    List<TiendaComprobante> findByClienteNumeroDoc(String clienteNumeroDoc);

    List<TiendaComprobante> findByFechaEmisionBetween(LocalDateTime inicio, LocalDateTime fin);

    List<TiendaComprobante> findByTiendaIdAndFechaEmisionBetween(
            Long tiendaId, LocalDateTime inicio, LocalDateTime fin);

    boolean existsByPedidoId(Long pedidoId);

    Optional<TiendaComprobante> findBySerieIdAndCorrelativo(Long serieId, Integer correlativo);
}

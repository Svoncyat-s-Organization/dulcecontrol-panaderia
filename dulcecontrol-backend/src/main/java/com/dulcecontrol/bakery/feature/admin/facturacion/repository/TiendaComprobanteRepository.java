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

    Optional<TiendaComprobante> findByIdAndTiendaId(Long id, Long tiendaId);

    List<TiendaComprobante> findByTiendaId(Long tiendaId);

    Optional<TiendaComprobante> findByPedidoIdAndTiendaId(Long pedidoId, Long tiendaId);

    List<TiendaComprobante> findBySerieId(Long serieId);

    List<TiendaComprobante> findByEstadoSunat(EstadoSunat estadoSunat);

    List<TiendaComprobante> findByTiendaIdAndEstadoSunat(Long tiendaId, EstadoSunat estadoSunat);

    List<TiendaComprobante> findByTiendaIdAndTipoComprobante(Long tiendaId, TipoComprobante tipoComprobante);

    List<TiendaComprobante> findByClienteNumeroDoc(String clienteNumeroDoc);

    List<TiendaComprobante> findByFechaEmisionBetween(LocalDateTime inicio, LocalDateTime fin);

    List<TiendaComprobante> findByTiendaIdAndFechaEmisionBetween(
            Long tiendaId, LocalDateTime inicio, LocalDateTime fin);

    boolean existsByTiendaIdAndPedidoId(Long tiendaId, Long pedidoId);

    Optional<TiendaComprobante> findBySerieIdAndCorrelativo(Long serieId, Integer correlativo);
}

package com.dulcecontrol.bakery.features.admin.ventas.repository;

import com.dulcecontrol.bakery.features.admin.ventas.entity.Pedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.features.admin.ventas.entity.enums.TipoEntregaPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    Optional<Pedido> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndCodigoPedidoIgnoreCase(Long tiendaId, String codigoPedido);

    boolean existsByTiendaIdAndCodigoPedidoIgnoreCaseAndIdNot(Long tiendaId, String codigoPedido, Long id);

    List<Pedido> findByTiendaIdOrderByCreadoEnDesc(Long tiendaId);

    List<Pedido> findByClienteIdOrderByCreadoEnDesc(Long clienteId);

    @Query("SELECT p FROM Pedido p WHERE p.tiendaId = :tiendaId AND (:sedeId IS NULL OR p.sedeOrigenId = :sedeId) " +
            "AND (:estadoPedido IS NULL OR p.estadoPedido = :estadoPedido) " +
            "AND (:estadoPago IS NULL OR p.estadoPago = :estadoPago) " +
            "AND (:tipoEntrega IS NULL OR p.tipoEntrega = :tipoEntrega) " +
            "AND (:fechaDesde IS NULL OR p.creadoEn >= :fechaDesde) " +
            "AND (:fechaHasta IS NULL OR p.creadoEn <= :fechaHasta) " +
            "ORDER BY p.creadoEn DESC")
    List<Pedido> buscarPorFiltros(@Param("tiendaId") Long tiendaId,
                                   @Param("sedeId") Long sedeId,
                                   @Param("estadoPedido") EstadoPedido estadoPedido,
                                   @Param("estadoPago") EstadoPagoPedido estadoPago,
                                   @Param("tipoEntrega") TipoEntregaPedido tipoEntrega,
                                   @Param("fechaDesde") LocalDateTime fechaDesde,
                                   @Param("fechaHasta") LocalDateTime fechaHasta);
}

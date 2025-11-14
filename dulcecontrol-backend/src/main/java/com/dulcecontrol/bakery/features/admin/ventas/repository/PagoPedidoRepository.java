package com.dulcecontrol.bakery.features.admin.ventas.repository;

import com.dulcecontrol.bakery.features.admin.ventas.entity.PagoPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PagoPedidoRepository extends JpaRepository<PagoPedido, Long> {

    List<PagoPedido> findByPedidoIdOrderByFechaPagoDesc(Long pedidoId);

    Optional<PagoPedido> findByIdAndPedidoId(Long id, Long pedidoId);
}

package com.dulcecontrol.bakery.feature.admin.ventas.repository;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    List<DetallePedido> findByPedidoId(Long pedidoId);

    Optional<DetallePedido> findByIdAndPedidoId(Long id, Long pedidoId);
}

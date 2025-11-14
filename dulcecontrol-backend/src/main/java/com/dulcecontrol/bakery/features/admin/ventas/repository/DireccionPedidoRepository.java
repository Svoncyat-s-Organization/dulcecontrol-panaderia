package com.dulcecontrol.bakery.features.admin.ventas.repository;

import com.dulcecontrol.bakery.features.admin.ventas.entity.DireccionPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DireccionPedidoRepository extends JpaRepository<DireccionPedido, Long> {

    List<DireccionPedido> findByPedidoId(Long pedidoId);

    Optional<DireccionPedido> findByIdAndPedidoId(Long id, Long pedidoId);
}

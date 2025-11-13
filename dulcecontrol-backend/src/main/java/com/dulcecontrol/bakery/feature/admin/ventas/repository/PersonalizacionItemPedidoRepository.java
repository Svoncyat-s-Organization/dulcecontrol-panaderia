package com.dulcecontrol.bakery.feature.admin.ventas.repository;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.PersonalizacionItemPedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonalizacionItemPedidoRepository extends JpaRepository<PersonalizacionItemPedido, Long> {

    Optional<PersonalizacionItemPedido> findByDetallePedidoId(Long detallePedidoId);

    Optional<PersonalizacionItemPedido> findByIdAndDetallePedidoId(Long id, Long detallePedidoId);

    boolean existsByDetallePedidoId(Long detallePedidoId);
}

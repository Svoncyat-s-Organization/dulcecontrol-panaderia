package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

}
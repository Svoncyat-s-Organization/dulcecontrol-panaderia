package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.PedidoItem;

public interface PedidoItemRepository extends JpaRepository<PedidoItem, Long> {

}
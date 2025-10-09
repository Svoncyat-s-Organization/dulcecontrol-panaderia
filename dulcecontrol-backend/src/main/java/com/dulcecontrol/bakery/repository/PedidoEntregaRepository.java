package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dulcecontrol.bakery.entity.PedidoEntrega;

@Repository
public interface PedidoEntregaRepository extends JpaRepository<PedidoEntrega, Long> {

}
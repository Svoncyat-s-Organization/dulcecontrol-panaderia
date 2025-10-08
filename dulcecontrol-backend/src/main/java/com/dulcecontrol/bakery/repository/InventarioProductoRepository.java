package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.InventarioProducto;
import com.dulcecontrol.bakery.entity.InventarioProductoId;

public interface InventarioProductoRepository extends JpaRepository<InventarioProducto, InventarioProductoId> {

}
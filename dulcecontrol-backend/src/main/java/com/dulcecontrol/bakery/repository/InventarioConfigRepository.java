package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.InventarioConfig;
import com.dulcecontrol.bakery.entity.InventarioProductoId;

public interface InventarioConfigRepository extends JpaRepository<InventarioConfig, InventarioProductoId> {

}
package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.VentaItem;

public interface VentaItemRepository extends JpaRepository<VentaItem, Long> {

}
package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.RecetaItem;

public interface RecetaItemRepository extends JpaRepository<RecetaItem, Long> {

}
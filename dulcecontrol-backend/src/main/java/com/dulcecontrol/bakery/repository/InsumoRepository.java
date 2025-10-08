package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Insumo;

public interface InsumoRepository extends JpaRepository<Insumo, Long> {

}
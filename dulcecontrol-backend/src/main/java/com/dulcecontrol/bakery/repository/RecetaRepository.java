package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Receta;

public interface RecetaRepository extends JpaRepository<Receta, Long> {

}
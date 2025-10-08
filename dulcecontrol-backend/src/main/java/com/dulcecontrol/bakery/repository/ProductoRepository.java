package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
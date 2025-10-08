package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
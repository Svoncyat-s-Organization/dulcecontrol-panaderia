package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

}
package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.UsuarioSede;
import com.dulcecontrol.bakery.entity.UsuarioSedeId;

public interface UsuarioSedeRepository extends JpaRepository<UsuarioSede, UsuarioSedeId> {

}
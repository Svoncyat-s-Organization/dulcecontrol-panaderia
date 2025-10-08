package com.dulcecontrol.bakery.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dulcecontrol.bakery.entity.RolPermiso;
import com.dulcecontrol.bakery.entity.RolPermisoId;

public interface RolPermisoRepository extends JpaRepository<RolPermiso, RolPermisoId> {

}
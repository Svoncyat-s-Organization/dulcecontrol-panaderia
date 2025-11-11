package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Long> {

    List<Permiso> findByModuloOrderByNombreVisibleAsc(String modulo);
}

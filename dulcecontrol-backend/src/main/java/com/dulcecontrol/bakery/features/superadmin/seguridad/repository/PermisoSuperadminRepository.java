package com.dulcecontrol.bakery.features.superadmin.seguridad.repository;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.PermisoSuperadmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface PermisoSuperadminRepository extends JpaRepository<PermisoSuperadmin, Long> {

    List<PermisoSuperadmin> findBySlugIn(Collection<String> slugs);

    List<PermisoSuperadmin> findAllByOrderByModuloAscNombreVisibleAsc();
}

package com.dulcecontrol.bakery.features.superadmin.seguridad.repository;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.RolSuperadmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolSuperadminRepository extends JpaRepository<RolSuperadmin, Long> {

    boolean existsByNombreIgnoreCase(String nombre);

    boolean existsByNombreIgnoreCaseAndIdNot(String nombre, Long id);
}

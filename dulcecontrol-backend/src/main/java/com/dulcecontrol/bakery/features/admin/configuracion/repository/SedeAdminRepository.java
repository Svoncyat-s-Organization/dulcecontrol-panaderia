package com.dulcecontrol.bakery.features.admin.configuracion.repository;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SedeAdminRepository extends JpaRepository<Sede, Long> {

    List<Sede> findByIdInAndActivoTrue(List<Long> ids);
}

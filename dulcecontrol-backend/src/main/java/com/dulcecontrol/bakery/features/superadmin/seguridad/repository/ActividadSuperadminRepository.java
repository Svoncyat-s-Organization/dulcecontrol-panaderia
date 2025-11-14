package com.dulcecontrol.bakery.features.superadmin.seguridad.repository;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.ActividadSuperadmin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActividadSuperadminRepository extends JpaRepository<ActividadSuperadmin, Long> {

    Page<ActividadSuperadmin> findBySuperadminId(Long superadminId, Pageable pageable);
}

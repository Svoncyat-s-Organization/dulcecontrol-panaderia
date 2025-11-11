package com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.Plan;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, Long id);

    List<Plan> findByActivoTrue(Sort sort);
}

package com.dulcecontrol.bakery.features.admin.produccion.repository;

import com.dulcecontrol.bakery.features.admin.produccion.entity.DetallePlanProduccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePlanProduccionRepository extends JpaRepository<DetallePlanProduccion, Long> {

    List<DetallePlanProduccion> findByPlanIdOrderByIdAsc(Long planId);

    void deleteByPlanId(Long planId);
}

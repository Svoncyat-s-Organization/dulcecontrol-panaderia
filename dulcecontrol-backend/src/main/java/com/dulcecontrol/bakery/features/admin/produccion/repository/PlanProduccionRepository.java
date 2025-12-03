package com.dulcecontrol.bakery.features.admin.produccion.repository;

import com.dulcecontrol.bakery.features.admin.produccion.entity.PlanProduccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlanProduccionRepository extends JpaRepository<PlanProduccion, Long> {

    Optional<PlanProduccion> findBySedeIdAndFechaProduccion(Long sedeId, LocalDate fechaProduccion);

    List<PlanProduccion> findByTiendaIdAndSedeIdOrderByFechaProduccionDesc(Long tiendaId, Long sedeId);

    List<PlanProduccion> findByTiendaIdOrderByFechaProduccionDesc(Long tiendaId);
}

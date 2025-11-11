package com.dulcecontrol.bakery.feature.superadmin.suscripciones.repository;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.HistorialSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialSuscripcionRepository extends JpaRepository<HistorialSuscripcion, Long> {

    List<HistorialSuscripcion> findBySuscripcionIdOrderByFechaMovimientoDesc(Long suscripcionId);
}

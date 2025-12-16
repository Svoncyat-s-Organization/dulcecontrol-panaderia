package com.dulcecontrol.bakery.features.superadmin.suscripciones.repository;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.Suscripcion;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.entity.enums.EstadoSuscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface SuscripcionRepository extends JpaRepository<Suscripcion, Long> {

    List<Suscripcion> findByTiendaId(Long tiendaId);

    List<Suscripcion> findByEstado(EstadoSuscripcion estado);

    List<Suscripcion> findByTiendaIdAndEstado(Long tiendaId, EstadoSuscripcion estado);

    List<Suscripcion> findByTiendaIdAndEstadoInOrderByFechaFinDesc(Long tiendaId, Collection<EstadoSuscripcion> estados);
}

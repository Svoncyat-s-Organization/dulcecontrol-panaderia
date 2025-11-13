package com.dulcecontrol.bakery.feature.admin.ventas.repository;

import com.dulcecontrol.bakery.feature.admin.ventas.entity.SesionCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SesionCajaRepository extends JpaRepository<SesionCaja, Long> {

    List<SesionCaja> findByTiendaIdOrderByFechaAperturaDesc(Long tiendaId);

    List<SesionCaja> findByTiendaIdAndCajaIdOrderByFechaAperturaDesc(Long tiendaId, Long cajaId);

    List<SesionCaja> findByTiendaIdAndEstaAbiertaOrderByFechaAperturaDesc(Long tiendaId, Boolean estaAbierta);

    List<SesionCaja> findByTiendaIdAndCajaIdAndEstaAbiertaOrderByFechaAperturaDesc(Long tiendaId, Long cajaId, Boolean estaAbierta);

    Optional<SesionCaja> findByIdAndTiendaId(Long id, Long tiendaId);
}

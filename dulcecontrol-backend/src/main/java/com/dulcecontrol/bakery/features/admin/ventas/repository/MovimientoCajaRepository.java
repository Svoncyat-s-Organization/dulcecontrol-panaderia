package com.dulcecontrol.bakery.features.admin.ventas.repository;

import com.dulcecontrol.bakery.features.admin.ventas.entity.MovimientoCaja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovimientoCajaRepository extends JpaRepository<MovimientoCaja, Long> {

    List<MovimientoCaja> findBySesionCajaIdOrderByCreadoEnDesc(Long sesionCajaId);

    Optional<MovimientoCaja> findByIdAndSesionCajaId(Long id, Long sesionCajaId);
}

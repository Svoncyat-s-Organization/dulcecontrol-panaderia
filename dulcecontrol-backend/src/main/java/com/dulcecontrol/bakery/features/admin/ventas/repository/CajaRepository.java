package com.dulcecontrol.bakery.features.admin.ventas.repository;

import com.dulcecontrol.bakery.features.admin.ventas.entity.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CajaRepository extends JpaRepository<Caja, Long> {

    List<Caja> findByTiendaIdOrderByNombreAsc(Long tiendaId);

    List<Caja> findByTiendaIdAndSedeIdOrderByNombreAsc(Long tiendaId, Long sedeId);

    Optional<Caja> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombreIgnoreCase(Long tiendaId, String nombre);

    boolean existsByTiendaIdAndNombreIgnoreCaseAndIdNot(Long tiendaId, String nombre, Long id);
}

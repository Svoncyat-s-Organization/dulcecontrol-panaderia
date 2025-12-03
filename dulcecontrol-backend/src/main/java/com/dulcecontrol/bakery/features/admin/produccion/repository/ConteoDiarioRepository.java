package com.dulcecontrol.bakery.features.admin.produccion.repository;

import com.dulcecontrol.bakery.features.admin.produccion.entity.ConteoDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConteoDiarioRepository extends JpaRepository<ConteoDiario, Long> {

    Optional<ConteoDiario> findBySedeIdAndFechaConteo(Long sedeId, LocalDate fechaConteo);

    List<ConteoDiario> findByTiendaIdAndSedeIdOrderByFechaConteoDesc(Long tiendaId, Long sedeId);
}

package com.dulcecontrol.bakery.feature.superadmin.tiendas.repository;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Long> {

    List<Sede> findByTiendaId(Long tiendaId);

    Optional<Sede> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndCodigoInterno(Long tiendaId, String codigoInterno);

    boolean existsByTiendaIdAndCodigoInternoAndIdNot(Long tiendaId, String codigoInterno, Long id);

    long countByTiendaIdAndEsPrincipalTrue(Long tiendaId);
}

package com.dulcecontrol.bakery.features.superadmin.tiendas.repository;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DominioTiendaRepository extends JpaRepository<DominioTienda, Long> {

    List<DominioTienda> findByTiendaId(Long tiendaId);

    Optional<DominioTienda> findByIdAndTiendaId(Long dominioId, Long tiendaId);

    boolean existsByUrlDominio(String urlDominio);

    boolean existsByUrlDominioAndIdNot(String urlDominio, Long dominioId);
}

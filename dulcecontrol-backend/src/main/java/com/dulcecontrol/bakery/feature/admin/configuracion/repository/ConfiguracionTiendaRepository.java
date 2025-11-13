package com.dulcecontrol.bakery.feature.admin.configuracion.repository;

import com.dulcecontrol.bakery.feature.admin.configuracion.entity.ConfiguracionTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfiguracionTiendaRepository extends JpaRepository<ConfiguracionTienda, Long> {

    Optional<ConfiguracionTienda> findByTiendaId(Long tiendaId);
}
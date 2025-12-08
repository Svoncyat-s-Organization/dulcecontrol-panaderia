package com.dulcecontrol.bakery.features.shared.ubigeo.repository;

import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoDepartamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbigeoDepartamentoRepository extends JpaRepository<UbigeoDepartamento, Long> {
    
    List<UbigeoDepartamento> findAllByOrderByNombreAsc();
}

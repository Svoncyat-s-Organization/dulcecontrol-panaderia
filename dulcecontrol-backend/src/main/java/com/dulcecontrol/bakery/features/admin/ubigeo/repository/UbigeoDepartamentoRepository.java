package com.dulcecontrol.bakery.features.admin.ubigeo.repository;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoDepartamento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbigeoDepartamentoRepository extends JpaRepository<UbigeoDepartamento, Long> {

    List<UbigeoDepartamento> findAllByOrderByNombreAsc();
}

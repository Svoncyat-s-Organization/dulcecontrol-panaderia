package com.dulcecontrol.bakery.features.admin.ubigeo.repository;

import com.dulcecontrol.bakery.features.admin.ubigeo.entity.UbigeoProvincia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UbigeoProvinciaRepository extends JpaRepository<UbigeoProvincia, Long> {

    List<UbigeoProvincia> findByDepartamentoIdOrderByNombreAsc(Long departamentoId);
}

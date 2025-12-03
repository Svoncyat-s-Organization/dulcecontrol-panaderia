package com.dulcecontrol.bakery.features.shared.ubigeo.repository;

import com.dulcecontrol.bakery.features.shared.ubigeo.entity.UbigeoProvincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbigeoProvinciaRepository extends JpaRepository<UbigeoProvincia, Long> {
    
    List<UbigeoProvincia> findByDepartamentoIdOrderByNombreAsc(Long departamentoId);
}

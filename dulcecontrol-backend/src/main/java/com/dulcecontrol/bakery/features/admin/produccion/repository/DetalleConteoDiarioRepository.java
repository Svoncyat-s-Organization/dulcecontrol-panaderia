package com.dulcecontrol.bakery.features.admin.produccion.repository;

import com.dulcecontrol.bakery.features.admin.produccion.entity.DetalleConteoDiario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleConteoDiarioRepository extends JpaRepository<DetalleConteoDiario, Long> {

    List<DetalleConteoDiario> findByConteoIdOrderByIdAsc(Long conteoId);

    void deleteByConteoId(Long conteoId);
}

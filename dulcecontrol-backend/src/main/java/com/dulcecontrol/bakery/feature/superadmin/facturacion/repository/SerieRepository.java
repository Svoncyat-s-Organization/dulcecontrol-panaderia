package com.dulcecontrol.bakery.feature.superadmin.facturacion.repository;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.Serie;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SerieRepository extends JpaRepository<Serie, Integer> {
    List<Serie> findByActivoTrueOrderBySerieAsc();
    List<Serie> findByTiposComprobanteOrderBySerieAsc(TipoComprobante tiposComprobante);
    Optional<Serie> findBySerie(String serie);
}
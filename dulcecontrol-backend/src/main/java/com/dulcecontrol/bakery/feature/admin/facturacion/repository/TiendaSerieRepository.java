package com.dulcecontrol.bakery.feature.admin.facturacion.repository;

import com.dulcecontrol.bakery.feature.admin.facturacion.entity.TiendaSerie;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TiendaSerieRepository extends JpaRepository<TiendaSerie, Long> {

    List<TiendaSerie> findByTiendaId(Long tiendaId);

    List<TiendaSerie> findBySedeId(Long sedeId);

    List<TiendaSerie> findByTiendaIdAndActivaTrue(Long tiendaId);

    List<TiendaSerie> findBySedeIdAndActivaTrue(Long sedeId);

    Optional<TiendaSerie> findByIdAndActivaTrue(Long id);

    Optional<TiendaSerie> findByTiendaIdAndSedeIdAndTipoComprobanteAndSerieAndActivaTrue(
            Long tiendaId, Long sedeId, TipoComprobante tipoComprobante, String serie);

    List<TiendaSerie> findByTiendaIdAndTipoComprobanteAndActivaTrue(
            Long tiendaId, TipoComprobante tipoComprobante);

    boolean existsBySerieAndActivaTrue(String serie);
}

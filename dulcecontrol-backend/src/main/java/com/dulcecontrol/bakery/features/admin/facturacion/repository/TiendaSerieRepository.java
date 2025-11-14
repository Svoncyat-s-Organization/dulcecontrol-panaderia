package com.dulcecontrol.bakery.features.admin.facturacion.repository;

import com.dulcecontrol.bakery.features.admin.facturacion.entity.TiendaSerie;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TiendaSerieRepository extends JpaRepository<TiendaSerie, Long> {

        Optional<TiendaSerie> findByIdAndTiendaId(Long id, Long tiendaId);

        List<TiendaSerie> findByTiendaId(Long tiendaId);

        List<TiendaSerie> findByTiendaIdAndSedeId(Long tiendaId, Long sedeId);

        List<TiendaSerie> findByTiendaIdAndActivaTrue(Long tiendaId);

        List<TiendaSerie> findBySedeIdAndActivaTrue(Long sedeId);

        Optional<TiendaSerie> findByIdAndActivaTrue(Long id);

        Optional<TiendaSerie> findByTiendaIdAndSedeIdAndTipoComprobanteAndSerieAndActivaTrue(
                        Long tiendaId, Long sedeId, TipoComprobante tipoComprobante, String serie);

        List<TiendaSerie> findByTiendaIdAndTipoComprobanteAndActivaTrue(
                        Long tiendaId, TipoComprobante tipoComprobante);

        boolean existsByTiendaIdAndSerieAndActivaTrue(Long tiendaId, String serie);
}

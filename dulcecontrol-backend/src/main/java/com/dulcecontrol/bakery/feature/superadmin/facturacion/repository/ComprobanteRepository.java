package com.dulcecontrol.bakery.feature.superadmin.facturacion.repository;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.Comprobante;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.TipoComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComprobanteRepository extends JpaRepository<Comprobante, Long> {
    List<Comprobante> findByTiendaIdOrderByFechaEmisionDesc(Long tiendaId);
    List<Comprobante> findByEstadosSunatOrderByFechaEmisionDesc(EstadoSunat estado);
    List<Comprobante> findByTiposComprobanteOrderByCorrelativoDesc(TipoComprobante tipo);
}
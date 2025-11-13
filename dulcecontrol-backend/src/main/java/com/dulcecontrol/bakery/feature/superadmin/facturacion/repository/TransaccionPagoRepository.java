package com.dulcecontrol.bakery.feature.superadmin.facturacion.repository;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.TransaccionPago;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.entity.enums.EstadoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransaccionPagoRepository extends JpaRepository<TransaccionPago, Long> {
    List<TransaccionPago> findByComprobanteIdOrderByCreadoEnDesc(Long comprobanteId);
    List<TransaccionPago> findByEstadoOrderByCreadoEnDesc(EstadoTransaccion estado);
}
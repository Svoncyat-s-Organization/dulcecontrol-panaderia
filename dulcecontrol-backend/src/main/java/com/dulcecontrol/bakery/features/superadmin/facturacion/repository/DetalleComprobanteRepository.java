package com.dulcecontrol.bakery.features.superadmin.facturacion.repository;

import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.DetalleComprobante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleComprobanteRepository extends JpaRepository<DetalleComprobante, Long> {
    List<DetalleComprobante> findByComprobanteId(Long comprobanteId);
}
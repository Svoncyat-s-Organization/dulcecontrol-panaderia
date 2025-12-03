package com.dulcecontrol.bakery.features.superadmin.facturacion.repository;

import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.MetodoPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MetodoPagoRepository extends JpaRepository<MetodoPago, Long> {
}

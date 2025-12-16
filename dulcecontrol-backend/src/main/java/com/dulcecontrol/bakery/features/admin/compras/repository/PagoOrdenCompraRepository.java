package com.dulcecontrol.bakery.features.admin.compras.repository;

import com.dulcecontrol.bakery.features.admin.compras.entity.PagoOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagoOrdenCompraRepository extends JpaRepository<PagoOrdenCompra, Long> {
    
    List<PagoOrdenCompra> findByOrdenCompraIdOrderByFechaPagoDesc(Long ordenCompraId);
    
    List<PagoOrdenCompra> findAllByOrdenCompraId(Long ordenCompraId);
}

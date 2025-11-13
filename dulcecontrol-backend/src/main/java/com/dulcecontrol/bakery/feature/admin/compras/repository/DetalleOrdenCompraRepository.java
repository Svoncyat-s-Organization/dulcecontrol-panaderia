package com.dulcecontrol.bakery.feature.admin.compras.repository;

import com.dulcecontrol.bakery.feature.admin.compras.entity.DetalleOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenCompraRepository extends JpaRepository<DetalleOrdenCompra, Long> {

    List<DetalleOrdenCompra> findByOrdenCompraId(Long ordenCompraId);

    @Query("SELECT d FROM DetalleOrdenCompra d WHERE d.ordenCompraId = :ordenCompraId AND d.recibidoCompleto = false")
    List<DetalleOrdenCompra> findDetallesPendientesByOrdenCompraId(@Param("ordenCompraId") Long ordenCompraId);

    @Query("SELECT d FROM DetalleOrdenCompra d WHERE d.insumoId = :insumoId")
    List<DetalleOrdenCompra> findByInsumoId(@Param("insumoId") Long insumoId);

    void deleteByOrdenCompraId(Long ordenCompraId);
}

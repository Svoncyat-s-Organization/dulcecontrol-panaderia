package com.dulcecontrol.bakery.features.admin.compras.repository;

import com.dulcecontrol.bakery.features.admin.compras.entity.OrdenCompra;
import com.dulcecontrol.bakery.features.admin.compras.entity.enums.EstadoOrdenCompra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrdenCompraRepository extends JpaRepository<OrdenCompra, Long> {

    List<OrdenCompra> findByTiendaId(Long tiendaId);

    Optional<OrdenCompra> findByIdAndTiendaId(Long id, Long tiendaId);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.tiendaId = :tiendaId AND oc.estado = :estado ORDER BY oc.fechaEmision DESC")
    List<OrdenCompra> findByTiendaIdAndEstado(@Param("tiendaId") Long tiendaId,
            @Param("estado") EstadoOrdenCompra estado);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.sedeDestinoId = :sedeId ORDER BY oc.fechaEmision DESC")
    List<OrdenCompra> findBySedeDestino(@Param("sedeId") Long sedeId);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.sedeDestinoId = :sedeId AND oc.estado = :estado ORDER BY oc.fechaEmision DESC")
    List<OrdenCompra> findBySedeDestinoAndEstado(@Param("sedeId") Long sedeId,
            @Param("estado") EstadoOrdenCompra estado);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.proveedorId = :proveedorId ORDER BY oc.fechaEmision DESC")
    List<OrdenCompra> findByProveedor(@Param("proveedorId") Long proveedorId);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.sedeDestinoId = :sedeId AND oc.estado IN :estados AND oc.fechaRecepcionEsperada <= :fecha")
    List<OrdenCompra> findOrdenesPendientesPorSede(@Param("sedeId") Long sedeId,
            @Param("estados") List<EstadoOrdenCompra> estados, @Param("fecha") LocalDate fecha);

    @Query("SELECT oc FROM OrdenCompra oc WHERE oc.tiendaId = :tiendaId AND oc.fechaEmision BETWEEN :fechaInicio AND :fechaFin ORDER BY oc.fechaEmision DESC")
    List<OrdenCompra> findByTiendaIdAndFechaEmisionBetween(@Param("tiendaId") Long tiendaId,
            @Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
}

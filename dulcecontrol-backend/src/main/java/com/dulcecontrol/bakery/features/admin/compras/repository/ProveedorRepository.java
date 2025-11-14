package com.dulcecontrol.bakery.features.admin.compras.repository;

import com.dulcecontrol.bakery.features.admin.compras.entity.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProveedorRepository extends JpaRepository<Proveedor, Long> {

    List<Proveedor> findByTiendaIdAndActivoTrue(Long tiendaId);

    Optional<Proveedor> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombreComercial(Long tiendaId, String nombreComercial);

    boolean existsByTiendaIdAndNombreComercialAndIdNot(Long tiendaId, String nombreComercial, Long id);

    @Query("SELECT p FROM Proveedor p WHERE p.tiendaId = :tiendaId AND p.esGenerico = true")
    Optional<Proveedor> findProveedorGenerico(@Param("tiendaId") Long tiendaId);

    @Query("SELECT p FROM Proveedor p WHERE p.tiendaId = :tiendaId AND p.numeroDoc = :numeroDoc")
    Optional<Proveedor> findByTiendaIdAndNumeroDoc(@Param("tiendaId") Long tiendaId,
            @Param("numeroDoc") String numeroDoc);
}

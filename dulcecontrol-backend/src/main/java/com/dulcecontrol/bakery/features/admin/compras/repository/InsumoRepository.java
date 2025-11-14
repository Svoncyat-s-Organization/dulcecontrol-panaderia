package com.dulcecontrol.bakery.features.admin.compras.repository;

import com.dulcecontrol.bakery.features.admin.compras.entity.Insumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InsumoRepository extends JpaRepository<Insumo, Long> {

    List<Insumo> findByTiendaIdAndActivoTrue(Long tiendaId);

    Optional<Insumo> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombre(Long tiendaId, String nombre);

    boolean existsByTiendaIdAndNombreAndIdNot(Long tiendaId, String nombre, Long id);

    @Query("SELECT i FROM Insumo i WHERE i.tiendaId = :tiendaId AND i.activo = true AND i.stockActualGlobal <= i.stockMinimoGlobal")
    List<Insumo> findInsumosConStockBajo(@Param("tiendaId") Long tiendaId);

    @Query("SELECT i FROM Insumo i WHERE i.tiendaId = :tiendaId AND i.codigoInterno = :codigoInterno")
    Optional<Insumo> findByTiendaIdAndCodigoInterno(@Param("tiendaId") Long tiendaId,
            @Param("codigoInterno") String codigoInterno);
}

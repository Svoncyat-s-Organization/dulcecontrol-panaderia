package com.dulcecontrol.bakery.features.admin.configuracion.repository;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.DominioTienda;
import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.enums.TipoDominioTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DominioTiendaAdminRepository extends JpaRepository<DominioTienda, Long> {

    @Query("SELECT d FROM DominioTienda d WHERE d.tienda.id = :tiendaId AND d.tipo = :tipo")
    Optional<DominioTienda> findByTienda_IdAndTipo(@Param("tiendaId") Long tiendaId, @Param("tipo") TipoDominioTienda tipo);

    @Query("SELECT d FROM DominioTienda d WHERE d.tienda.id = :tiendaId AND d.tipo = 'TIENDA_VIRTUAL'")
    Optional<DominioTienda> findByTiendaIdAndTipoTiendaVirtual(@Param("tiendaId") Long tiendaId);
}

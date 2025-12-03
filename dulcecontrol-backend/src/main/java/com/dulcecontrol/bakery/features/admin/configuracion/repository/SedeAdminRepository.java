package com.dulcecontrol.bakery.features.admin.configuracion.repository;

import com.dulcecontrol.bakery.features.superadmin.tiendas.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SedeAdminRepository extends JpaRepository<Sede, Long> {

    List<Sede> findByIdInAndActivoTrue(List<Long> ids);

    List<Sede> findByTiendaIdOrderByEsPrincipalDescNombreAsc(Long tiendaId);

    Optional<Sede> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombreAndIdNot(Long tiendaId, String nombre, Long id);

    boolean existsByTiendaIdAndCodigoInternoAndIdNot(Long tiendaId, String codigoInterno, Long id);

    boolean existsByTiendaIdAndNombre(Long tiendaId, String nombre);

    boolean existsByTiendaIdAndCodigoInterno(Long tiendaId, String codigoInterno);

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END FROM Sede s " +
           "WHERE s.tienda.id = :tiendaId AND s.esPrincipal = true AND s.id <> :sedeId")
    boolean existsOtraSedePrincipal(@Param("tiendaId") Long tiendaId, @Param("sedeId") Long sedeId);
}

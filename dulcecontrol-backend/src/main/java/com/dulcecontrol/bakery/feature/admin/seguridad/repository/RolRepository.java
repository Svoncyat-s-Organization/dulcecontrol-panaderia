package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {

    List<Rol> findByTiendaId(Long tiendaId);

    Optional<Rol> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombre(Long tiendaId, String nombre);

    boolean existsByTiendaIdAndNombreAndIdNot(Long tiendaId, String nombre, Long id);

    @Query("SELECT r FROM Rol r WHERE r.tiendaId = :tiendaId AND r.esSistema = true")
    List<Rol> findRolesSistema(@Param("tiendaId") Long tiendaId);
}

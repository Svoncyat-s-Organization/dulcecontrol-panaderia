package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.RolPermiso;
import com.dulcecontrol.bakery.feature.admin.seguridad.entity.RolPermisoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RolPermisoRepository extends JpaRepository<RolPermiso, RolPermisoId> {

    @Query("SELECT rp.id.permisoId FROM RolPermiso rp WHERE rp.id.rolId = :rolId")
    List<Long> findPermisoIdsByRolId(@Param("rolId") Long rolId);

    @Modifying
    @Query("DELETE FROM RolPermiso rp WHERE rp.id.rolId = :rolId")
    void deleteByRolId(@Param("rolId") Long rolId);

    @Modifying
    @Query(value = "INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (:rolId, :permisoId)", nativeQuery = true)
    void insertarRelacion(@Param("rolId") Long rolId, @Param("permisoId") Long permisoId);
}

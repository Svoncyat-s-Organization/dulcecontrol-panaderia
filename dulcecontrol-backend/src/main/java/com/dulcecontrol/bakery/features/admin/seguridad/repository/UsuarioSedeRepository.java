package com.dulcecontrol.bakery.features.admin.seguridad.repository;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSede;
import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioSedeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioSedeRepository extends JpaRepository<UsuarioSede, UsuarioSedeId> {

    List<UsuarioSede> findByIdUsuarioId(Long usuarioId);

    List<UsuarioSede> findByIdUsuarioIdIn(List<Long> usuarioIds);

    List<UsuarioSede> findByIdSedeId(Long sedeId);

    @Modifying
    @Query("DELETE FROM UsuarioSede us WHERE us.id.usuarioId = :usuarioId")
    void deleteByIdUsuarioId(@Param("usuarioId") Long usuarioId);

    @Modifying
    @Query("DELETE FROM UsuarioSede us WHERE us.id.sedeId = :sedeId")
    void deleteByIdSedeId(@Param("sedeId") Long sedeId);
}

package com.dulcecontrol.bakery.features.superadmin.seguridad.repository;

import com.dulcecontrol.bakery.features.superadmin.seguridad.entity.UsuarioSuperadmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioSuperadminRepository extends JpaRepository<UsuarioSuperadmin, Long> {

    Optional<UsuarioSuperadmin> findByCorreo(String correo);

    boolean existsByCorreo(String correo);

    boolean existsByNumeroDoc(String numeroDoc);

    boolean existsByCorreoAndIdNot(String correo, Long id);

    boolean existsByNumeroDocAndIdNot(String numeroDoc, Long id);

    boolean existsByRoles_Id(Long rolId);

    long countByRoles_Id(Long rolId);
}

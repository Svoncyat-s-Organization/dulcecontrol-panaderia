package com.dulcecontrol.bakery.security.token.repository;

import com.dulcecontrol.bakery.security.token.entity.DesarrolladorToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesarrolladorTokenRepository extends JpaRepository<DesarrolladorToken, Long> {

    Optional<DesarrolladorToken> findByCorreo(String correo);

    Optional<DesarrolladorToken> findByNombreCompleto(String nombreCompleto);

    boolean existsByCorreo(String correo);

    boolean existsByNombreCompleto(String nombreCompleto);
}

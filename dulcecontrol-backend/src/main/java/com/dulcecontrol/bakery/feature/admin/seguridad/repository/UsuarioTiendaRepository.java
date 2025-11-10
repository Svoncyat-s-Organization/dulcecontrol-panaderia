package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioTiendaRepository extends JpaRepository<UsuarioTienda, Long> {

    Optional<UsuarioTienda> findByCorreo(String correo);

    Optional<UsuarioTienda> findByTiendaIdAndCorreo(Long tiendaId, String correo);

    @Query("SELECT u FROM UsuarioTienda u WHERE u.correo = :correo AND u.activo = true")
    Optional<UsuarioTienda> findByCorreoAndActivo(@Param("correo") String correo);

    boolean existsByTiendaIdAndCorreo(Long tiendaId, String correo);

    boolean existsByTiendaIdAndNumeroDoc(Long tiendaId, String numeroDoc);
}
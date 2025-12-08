package com.dulcecontrol.bakery.features.admin.seguridad.repository;

import com.dulcecontrol.bakery.features.admin.seguridad.entity.UsuarioTienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioTiendaRepository extends JpaRepository<UsuarioTienda, Long> {

    Optional<UsuarioTienda> findByCorreo(String correo);

    Optional<UsuarioTienda> findByTiendaIdAndCorreo(Long tiendaId, String correo);

    @Query("SELECT u FROM UsuarioTienda u WHERE u.correo = :correo AND u.activo = true")
    Optional<UsuarioTienda> findByCorreoAndActivo(@Param("correo") String correo);

    boolean existsByTiendaIdAndCorreo(Long tiendaId, String correo);

    boolean existsByTiendaIdAndNumeroDoc(Long tiendaId, String numeroDoc);

    boolean existsByTiendaIdAndCorreoAndIdNot(Long tiendaId, String correo, Long id);

    boolean existsByTiendaIdAndNumeroDocAndIdNot(Long tiendaId, String numeroDoc, Long id);

    boolean existsByTiendaIdAndRolId(Long tiendaId, Long rolId);

    List<UsuarioTienda> findByTiendaId(Long tiendaId);

    Optional<UsuarioTienda> findByIdAndTiendaId(Long id, Long tiendaId);
}
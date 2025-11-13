package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.AuditoriaUsuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditoriaUsuarioRepository extends JpaRepository<AuditoriaUsuario, Long> {

    List<AuditoriaUsuario> findByTiendaIdOrderByCreadoEnDesc(Long tiendaId);

    Page<AuditoriaUsuario> findByTiendaIdOrderByCreadoEnDesc(Long tiendaId, Pageable pageable);

    List<AuditoriaUsuario> findByUsuarioIdOrderByCreadoEnDesc(Long usuarioId);

    List<AuditoriaUsuario> findByTiendaIdAndCreadoEnBetweenOrderByCreadoEnDesc(
            Long tiendaId, LocalDateTime inicio, LocalDateTime fin);

    List<AuditoriaUsuario> findByEntidadAndEntidadIdOrderByCreadoEnDesc(String entidad, Long entidadId);
}

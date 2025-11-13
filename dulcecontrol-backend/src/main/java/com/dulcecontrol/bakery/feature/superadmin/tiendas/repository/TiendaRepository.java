package com.dulcecontrol.bakery.feature.superadmin.tiendas.repository;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.entity.Tienda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TiendaRepository extends JpaRepository<Tienda, Long> {

    boolean existsByNumeroDoc(String numeroDoc);

    boolean existsByNumeroDocAndIdNot(String numeroDoc, Long id);

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByCorreoContacto(String correoContacto);

    boolean existsByCorreoContactoAndIdNot(String correoContacto, Long id);

    Optional<Tienda> findBySlug(String slug);
}

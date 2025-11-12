package com.dulcecontrol.bakery.feature.admin.catalogo.repository;

import com.dulcecontrol.bakery.feature.admin.catalogo.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    List<Categoria> findByTiendaIdOrderByOrdenVisualAscNombreAsc(Long tiendaId);

    Optional<Categoria> findByIdAndTiendaId(Long id, Long tiendaId);

    boolean existsByTiendaIdAndNombreIgnoreCase(Long tiendaId, String nombre);

    boolean existsByTiendaIdAndSlugIgnoreCase(Long tiendaId, String slug);

    boolean existsByTiendaIdAndNombreIgnoreCaseAndIdNot(Long tiendaId, String nombre, Long id);

    boolean existsByTiendaIdAndSlugIgnoreCaseAndIdNot(Long tiendaId, String slug, Long id);
}

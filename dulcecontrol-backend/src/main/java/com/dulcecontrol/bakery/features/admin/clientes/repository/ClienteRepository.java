package com.dulcecontrol.bakery.features.admin.clientes.repository;

import com.dulcecontrol.bakery.features.admin.clientes.entity.Cliente;
import com.dulcecontrol.bakery.features.admin.clientes.entity.enums.TipoDocumento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    List<Cliente> findByTiendaId(Long tiendaId);

    Optional<Cliente> findByIdAndTiendaId(Long id, Long tiendaId);

        @Query("SELECT c FROM Cliente c WHERE c.tiendaId = :tiendaId AND LOWER(c.email) = LOWER(:email)")
        Optional<Cliente> findByTiendaIdAndEmail(@Param("tiendaId") Long tiendaId, @Param("email") String email);

    @Query("SELECT COUNT(c) > 0 FROM Cliente c WHERE c.tiendaId = :tiendaId AND c.tipoDoc = :tipoDoc AND c.numeroDoc = :numeroDoc AND c.activo = true")
    boolean existsByTiendaIdAndTipoDocAndNumeroDoc(@Param("tiendaId") Long tiendaId,
            @Param("tipoDoc") TipoDocumento tipoDoc, @Param("numeroDoc") String numeroDoc);

    boolean existsByTiendaIdAndEmail(Long tiendaId, String email);

    @Query("SELECT COUNT(c) > 0 FROM Cliente c WHERE c.tiendaId = :tiendaId AND c.tipoDoc = :tipoDoc AND c.numeroDoc = :numeroDoc AND c.id != :id AND c.activo = true")
    boolean existsByTiendaIdAndTipoDocAndNumeroDocAndIdNot(@Param("tiendaId") Long tiendaId,
            @Param("tipoDoc") TipoDocumento tipoDoc, @Param("numeroDoc") String numeroDoc, @Param("id") Long id);

    boolean existsByTiendaIdAndEmailAndIdNot(Long tiendaId, String email, Long id);

    @Query("SELECT c FROM Cliente c WHERE c.tiendaId = :tiendaId AND c.activo = true AND " +
            "(c.nombreDoc LIKE %:busqueda% OR c.email LIKE %:busqueda% OR c.numeroDoc LIKE %:busqueda%)")
    List<Cliente> buscarPorTiendaYTexto(@Param("tiendaId") Long tiendaId, @Param("busqueda") String busqueda);

    List<Cliente> findByTiendaIdAndEsUsuarioVirtual(Long tiendaId, Boolean esUsuarioVirtual);
}
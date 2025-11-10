package com.dulcecontrol.bakery.feature.admin.seguridad.repository;

import com.dulcecontrol.bakery.feature.admin.seguridad.entity.UsuarioToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioTokenRepository extends JpaRepository<UsuarioToken, Long> {

    Optional<UsuarioToken> findByTokenHash(String tokenHash);

    @Query("SELECT t FROM UsuarioToken t WHERE t.tokenHash = :tokenHash " +
            "AND t.expiraEn > :now AND t.revocadoEn IS NULL")
    Optional<UsuarioToken> findValidToken(@Param("tokenHash") String tokenHash,
            @Param("now") LocalDateTime now);

    List<UsuarioToken> findByUsuarioId(Long usuarioId);

    @Modifying
    @Query("UPDATE UsuarioToken t SET t.revocadoEn = :now WHERE t.usuario.id = :usuarioId AND t.revocadoEn IS NULL")
    void revocarTodosLosTokensDelUsuario(@Param("usuarioId") Long usuarioId,
            @Param("now") LocalDateTime now);

    @Modifying
    @Query("UPDATE UsuarioToken t SET t.ultimoUsoEn = :now WHERE t.id = :tokenId")
    void actualizarUltimoUso(@Param("tokenId") Long tokenId, @Param("now") LocalDateTime now);
}
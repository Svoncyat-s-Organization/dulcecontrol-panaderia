package com.dulcecontrol.bakery.security.token.service;

import com.dulcecontrol.bakery.security.token.dto.TokenListResponse;
import com.dulcecontrol.bakery.security.token.dto.TokenProfileResponse;
import com.dulcecontrol.bakery.security.token.dto.TokenRegisterRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ITokenService {

    /**
     * Registra un nuevo desarrollador y devuelve el token JWT
     */
    String register(TokenRegisterRequest request);

    /**
     * Autentica un desarrollador y devuelve el token JWT
     */
    String login(String correo, String contrasena);

    /**
     * Obtiene el perfil del desarrollador autenticado
     */
    TokenProfileResponse obtenerPerfil(String correo);

    /**
     * Lista todos los desarrolladores registrados (paginado)
     */
    Page<TokenListResponse> listarTodos(Pageable pageable);

    /**
     * Elimina un desarrollador (soft delete)
     */
    void eliminarDesarrollador(Long id);
}

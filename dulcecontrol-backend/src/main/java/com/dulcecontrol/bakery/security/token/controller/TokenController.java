package com.dulcecontrol.bakery.security.token.controller;

import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.token.dto.*;
import com.dulcecontrol.bakery.security.token.service.ITokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/token")
@RequiredArgsConstructor
public class TokenController {

    private final ITokenService tokenService;
    private final JwtProvider jwtProvider;

    /**
     * [POST] /api/token/register
     * Registra un nuevo desarrollador y devuelve el token de acceso
     */
    @PostMapping("/register")
    public ResponseEntity<TokenResponse> register(@Valid @RequestBody TokenRegisterRequest request) {
        String token = tokenService.register(request);

        TokenResponse response = new TokenResponse(
                token,
                "Bearer",
                jwtProvider.getExpirationTime()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * [POST] /api/token/login
     * Autentica un desarrollador y devuelve el token de acceso
     */
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody TokenLoginRequest request) {
        String token = tokenService.login(request.getCorreo(), request.getContrasena());

        TokenResponse response = new TokenResponse(
                token,
                "Bearer",
                jwtProvider.getExpirationTime()
        );

        return ResponseEntity.ok(response);
    }

    /**
     * [GET] /api/token/me
     * Obtiene el perfil del desarrollador autenticado
     * Requiere token JWT válido en el header Authorization
     */
    @GetMapping("/me")
    public ResponseEntity<TokenProfileResponse> obtenerPerfil(Authentication authentication) {
        String correo = authentication.getName();
        TokenProfileResponse profile = tokenService.obtenerPerfil(correo);
        return ResponseEntity.ok(profile);
    }

    /**
     * [GET] /api/token
     * Lista todos los desarrolladores registrados (paginado)
     * Requiere token JWT válido en el header Authorization
     */
    @GetMapping
    public ResponseEntity<Page<TokenListResponse>> listarTodos(Pageable pageable) {
        Page<TokenListResponse> desarrolladores = tokenService.listarTodos(pageable);
        return ResponseEntity.ok(desarrolladores);
    }

    /**
     * [DELETE] /api/token/{id}
     * Elimina un desarrollador (soft delete)
     * Requiere token JWT válido en el header Authorization
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDesarrollador(@PathVariable Long id) {
        tokenService.eliminarDesarrollador(id);
        return ResponseEntity.noContent().build();
    }
}

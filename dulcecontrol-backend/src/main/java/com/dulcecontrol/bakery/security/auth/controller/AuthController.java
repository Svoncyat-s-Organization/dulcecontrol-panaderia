package com.dulcecontrol.bakery.security.auth.controller;

import com.dulcecontrol.bakery.security.JwtProvider;
import com.dulcecontrol.bakery.security.auth.dto.LoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.LoginResponse;
import com.dulcecontrol.bakery.security.auth.dto.UserProfileResponse;
import com.dulcecontrol.bakery.security.auth.service.IAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final JwtProvider jwtProvider;

    /**
     * [POST] Login para usuarios Superadmin
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getCorreo(), request.getContrasena());

        LoginResponse response = new LoginResponse(
                token,
                "Bearer",
                jwtProvider.getExpirationTime());

        return ResponseEntity.ok(response);
    }

    /**
     * [GET] Obtener perfil del usuario autenticado
     * Requiere token JWT válido en el header Authorization
     */
    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> obtenerPerfil(Authentication authentication) {
        // Spring Security inyecta el Authentication con el usuario autenticado
        String correo = authentication.getName();
        UserProfileResponse profile = authService.obtenerPerfilUsuario(correo);
        return ResponseEntity.ok(profile);
    }
}

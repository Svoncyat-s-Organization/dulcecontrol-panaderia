package com.dulcecontrol.bakery.feature.admin.seguridad.controller;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.LoginRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.LoginResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IAuthService;
import com.dulcecontrol.bakery.security.JwtProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request.getCorreo(), request.getContrasena());
        
        LoginResponse response = new LoginResponse(
            token,
            "Bearer",
            jwtProvider.getExpirationTime()
        );
        
        return ResponseEntity.ok(response);
    }
}

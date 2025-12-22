package com.dulcecontrol.bakery.security.auth.controller;

import com.dulcecontrol.bakery.security.auth.dto.AdminLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.AuthTokenResponse;
import com.dulcecontrol.bakery.security.auth.dto.StorefrontLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.StorefrontRegisterRequest;
import com.dulcecontrol.bakery.security.auth.dto.SuperadminLoginRequest;
import com.dulcecontrol.bakery.security.auth.service.AuthService;
import com.dulcecontrol.bakery.features.storefront.auth.dto.ActivarCuentaRequest;
import com.dulcecontrol.bakery.features.storefront.auth.dto.VerificarEmailResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/superadmin/login")
    public ResponseEntity<AuthTokenResponse> loginSuperadmin(@Valid @RequestBody SuperadminLoginRequest request) {
        return ResponseEntity.ok(authService.loginSuperadmin(request));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthTokenResponse> loginAdmin(@Valid @RequestBody AdminLoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    @PostMapping("/storefront/login")
    public ResponseEntity<AuthTokenResponse> loginStorefront(@Valid @RequestBody StorefrontLoginRequest request) {
        return ResponseEntity.ok(authService.loginStorefront(request));
    }

    @PostMapping("/storefront/register")
    public ResponseEntity<AuthTokenResponse> registerStorefront(@Valid @RequestBody StorefrontRegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerStorefront(request));
    }

    /**
     * Verifica si un email existe y si pertenece a un cliente físico
     * GET /api/auth/storefront/verificar-email?tiendaId=1&email=cliente@email.com
     */
    @GetMapping("/storefront/verificar-email")
    public ResponseEntity<VerificarEmailResponse> verificarEmail(
            @RequestParam Long tiendaId,
            @RequestParam String email) {
        return ResponseEntity.ok(authService.verificarEmail(tiendaId, email));
    }

    /**
     * Activa la cuenta de un cliente físico para acceso virtual
     * POST /api/auth/storefront/activar-cuenta
     */
    @PostMapping("/storefront/activar-cuenta")
    public ResponseEntity<AuthTokenResponse> activarCuenta(
            @RequestParam Long tiendaId,
            @Valid @RequestBody ActivarCuentaRequest request) {
        return ResponseEntity.ok(authService.activarCuenta(tiendaId, request));
    }
}

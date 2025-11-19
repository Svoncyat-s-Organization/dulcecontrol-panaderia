package com.dulcecontrol.bakery.security.auth.controller;

import com.dulcecontrol.bakery.security.auth.dto.AdminLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.AuthTokenResponse;
import com.dulcecontrol.bakery.security.auth.dto.StorefrontLoginRequest;
import com.dulcecontrol.bakery.security.auth.dto.SuperadminLoginRequest;
import com.dulcecontrol.bakery.security.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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
}

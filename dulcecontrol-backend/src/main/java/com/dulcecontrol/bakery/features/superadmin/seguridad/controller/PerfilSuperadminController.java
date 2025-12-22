package com.dulcecontrol.bakery.features.superadmin.seguridad.controller;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.PerfilUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.repository.UsuarioSuperadminRepository;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IUsuarioSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/superadmin/perfil")
@RequiredArgsConstructor
public class PerfilSuperadminController {

    private final IUsuarioSuperadminService usuarioService;
    private final UsuarioSuperadminRepository usuarioSuperadminRepository;

    private Long resolveUsuarioId(Authentication authentication) {
        String correo = authentication.getName();
        return usuarioSuperadminRepository.findByCorreo(correo)
                .map(usuario -> usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioSuperadminResponse> obtenerMiPerfil(Authentication authentication) {
        Long usuarioId = resolveUsuarioId(authentication);
        UsuarioSuperadminResponse perfil = usuarioService.obtenerMiPerfil(usuarioId);
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioSuperadminResponse> actualizarMiPerfil(
            Authentication authentication,
            @Valid @RequestBody PerfilUpdateRequest request) {
        Long usuarioId = resolveUsuarioId(authentication);
        UsuarioSuperadminResponse perfil = usuarioService.actualizarMiPerfil(usuarioId, request);
        return ResponseEntity.ok(perfil);
    }
}

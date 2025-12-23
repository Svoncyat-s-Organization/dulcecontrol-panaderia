package com.dulcecontrol.bakery.features.admin.seguridad.controller;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.PerfilUpdateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.repository.UsuarioTiendaRepository;
import com.dulcecontrol.bakery.shared.exception.ResourceNotFoundException;
import com.dulcecontrol.bakery.features.admin.seguridad.service.IUsuarioAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final IUsuarioAdminService usuarioService;
    private final UsuarioTiendaRepository usuarioTiendaRepository;

    private Long resolveUsuarioId(Authentication authentication) {
        String correo = authentication.getName();
        return usuarioTiendaRepository.findByCorreo(correo)
                .map(usuario -> usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioResponse> obtenerMiPerfil(Authentication authentication) {
        Long usuarioId = resolveUsuarioId(authentication);
        UsuarioResponse perfil = usuarioService.obtenerMiPerfil(usuarioId);
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioResponse> actualizarMiPerfil(
            Authentication authentication,
            @Valid @RequestBody PerfilUpdateRequest request) {
        Long usuarioId = resolveUsuarioId(authentication);
        UsuarioResponse perfil = usuarioService.actualizarMiPerfil(usuarioId, request);
        return ResponseEntity.ok(perfil);
    }
}

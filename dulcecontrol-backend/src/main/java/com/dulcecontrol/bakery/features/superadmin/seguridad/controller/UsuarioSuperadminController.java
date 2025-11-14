package com.dulcecontrol.bakery.features.superadmin.seguridad.controller;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminUpdateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.service.IUsuarioSuperadminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/superadmin/seguridad/usuarios")
@RequiredArgsConstructor
@Validated
public class UsuarioSuperadminController {

    private final IUsuarioSuperadminService usuarioSuperadminService;

    @GetMapping
    public ResponseEntity<List<UsuarioSuperadminResponse>> listar() {
        return ResponseEntity.ok(usuarioSuperadminService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioSuperadminResponse> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioSuperadminService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioSuperadminResponse> crear(@Valid @RequestBody UsuarioSuperadminCreateRequest request) {
        UsuarioSuperadminResponse response = usuarioSuperadminService.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioSuperadminResponse> actualizar(@PathVariable Long id,
            @Valid @RequestBody UsuarioSuperadminUpdateRequest request) {
        return ResponseEntity.ok(usuarioSuperadminService.actualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioSuperadminService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}

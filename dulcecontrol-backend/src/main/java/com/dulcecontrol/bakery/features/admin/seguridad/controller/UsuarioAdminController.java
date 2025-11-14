package com.dulcecontrol.bakery.features.admin.seguridad.controller;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioUpdateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.service.IUsuarioAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/seguridad/usuarios")
@RequiredArgsConstructor
@Validated
public class UsuarioAdminController {

    private final IUsuarioAdminService usuarioAdminService;

    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(usuarioAdminService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long usuarioId) {
        return ResponseEntity.ok(usuarioAdminService.obtenerPorId(tiendaId, usuarioId));
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody UsuarioCreateRequest request) {
        UsuarioResponse response = usuarioAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long usuarioId,
            @Valid @RequestBody UsuarioUpdateRequest request) {
        UsuarioResponse response = usuarioAdminService.actualizar(tiendaId, usuarioId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long usuarioId) {
        usuarioAdminService.eliminar(tiendaId, usuarioId);
        return ResponseEntity.noContent().build();
    }
}

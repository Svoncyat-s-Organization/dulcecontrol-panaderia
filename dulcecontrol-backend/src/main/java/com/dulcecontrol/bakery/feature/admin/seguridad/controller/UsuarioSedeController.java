package com.dulcecontrol.bakery.feature.admin.seguridad.controller;

import com.dulcecontrol.bakery.feature.admin.seguridad.dto.AsignarSedesRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.dto.UsuarioSedeResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.service.IUsuarioSedeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/seguridad/usuarios/{usuarioId}/sedes")
@RequiredArgsConstructor
@Validated
public class UsuarioSedeController {

    private final IUsuarioSedeService usuarioSedeService;

    @GetMapping
    public ResponseEntity<List<UsuarioSedeResponse>> obtenerSedes(
            @PathVariable Long tiendaId,
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(usuarioSedeService.obtenerSedesPorUsuario(tiendaId, usuarioId));
    }

    @PostMapping
    public ResponseEntity<List<UsuarioSedeResponse>> asignarSedes(
            @PathVariable Long tiendaId,
            @PathVariable Long usuarioId,
            @Valid @RequestBody AsignarSedesRequest request) {
        List<UsuarioSedeResponse> response = usuarioSedeService.asignarSedes(tiendaId, usuarioId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{sedeId}")
    public ResponseEntity<Void> removerSede(
            @PathVariable Long tiendaId,
            @PathVariable Long usuarioId,
            @PathVariable Long sedeId) {
        usuarioSedeService.removerSede(tiendaId, usuarioId, sedeId);
        return ResponseEntity.noContent().build();
    }
}

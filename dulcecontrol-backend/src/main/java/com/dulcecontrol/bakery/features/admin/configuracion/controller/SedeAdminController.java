package com.dulcecontrol.bakery.features.admin.configuracion.controller;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeUpdateRequest;
import com.dulcecontrol.bakery.features.admin.configuracion.service.ISedeAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/configuracion/sedes")
@RequiredArgsConstructor
public class SedeAdminController {

    private final ISedeAdminService sedeService;

    @GetMapping
    public ResponseEntity<List<SedeResponse>> obtenerSedes(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(sedeService.obtenerSedesPorTienda(tiendaId));
    }

    @GetMapping("/{sedeId}")
    public ResponseEntity<SedeResponse> obtenerSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        return ResponseEntity.ok(sedeService.obtenerSedePorId(tiendaId, sedeId));
    }

    @PostMapping
    public ResponseEntity<SedeResponse> crearSede(
            @PathVariable Long tiendaId,
            @Valid @RequestBody SedeCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sedeService.crearSede(tiendaId, request));
    }

    @PutMapping("/{sedeId}")
    public ResponseEntity<SedeResponse> actualizarSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId,
            @Valid @RequestBody SedeUpdateRequest request) {
        return ResponseEntity.ok(sedeService.actualizarSede(tiendaId, sedeId, request));
    }

    @DeleteMapping("/{sedeId}")
    public ResponseEntity<Void> eliminarSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        sedeService.eliminarSede(tiendaId, sedeId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{sedeId}/desactivar")
    public ResponseEntity<Void> desactivarSede(
            @PathVariable Long tiendaId,
            @PathVariable Long sedeId) {
        sedeService.desactivarSede(tiendaId, sedeId);
        return ResponseEntity.noContent().build();
    }
}

package com.dulcecontrol.bakery.features.admin.produccion.controller;

import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaCreateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaResponse;
import com.dulcecontrol.bakery.features.admin.produccion.dto.RecetaUpdateRequest;
import com.dulcecontrol.bakery.features.admin.produccion.service.IRecetaAdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/produccion/recetas")
@RequiredArgsConstructor
@Validated
public class RecetaAdminController {

    private final IRecetaAdminService recetaAdminService;

    @GetMapping
    public ResponseEntity<List<RecetaResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(recetaAdminService.listarPorTienda(tiendaId));
    }

    @GetMapping("/{recetaId}")
    public ResponseEntity<RecetaResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long recetaId) {
        return ResponseEntity.ok(recetaAdminService.obtenerPorId(tiendaId, recetaId));
    }

    @PostMapping
    public ResponseEntity<RecetaResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody RecetaCreateRequest request) {
        RecetaResponse response = recetaAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{recetaId}")
    public ResponseEntity<RecetaResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long recetaId,
            @Valid @RequestBody RecetaUpdateRequest request) {
        RecetaResponse response = recetaAdminService.actualizar(tiendaId, recetaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{recetaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long recetaId) {
        recetaAdminService.eliminar(tiendaId, recetaId);
        return ResponseEntity.noContent().build();
    }
}

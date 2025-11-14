package com.dulcecontrol.bakery.feature.admin.catalogo.controller;

import com.dulcecontrol.bakery.feature.admin.catalogo.dto.CategoriaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.catalogo.dto.CategoriaResponse;
import com.dulcecontrol.bakery.feature.admin.catalogo.dto.CategoriaUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.catalogo.service.ICategoriaAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/catalogo/categorias")
@RequiredArgsConstructor
@Validated
public class CategoriaAdminController {

    private final ICategoriaAdminService categoriaAdminService;

    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(categoriaAdminService.listar(tiendaId));
    }

    @GetMapping("/{categoriaId}")
    public ResponseEntity<CategoriaResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long categoriaId) {
        return ResponseEntity.ok(categoriaAdminService.obtener(tiendaId, categoriaId));
    }

    @PostMapping
    public ResponseEntity<CategoriaResponse> crear(@PathVariable Long tiendaId,
                                                   @Valid @RequestBody CategoriaCreateRequest request) {
        CategoriaResponse response = categoriaAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{categoriaId}")
    public ResponseEntity<CategoriaResponse> actualizar(@PathVariable Long tiendaId,
                                                         @PathVariable Long categoriaId,
                                                         @Valid @RequestBody CategoriaUpdateRequest request) {
        CategoriaResponse response = categoriaAdminService.actualizar(tiendaId, categoriaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{categoriaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long categoriaId) {
        categoriaAdminService.eliminar(tiendaId, categoriaId);
        return ResponseEntity.noContent().build();
    }
}

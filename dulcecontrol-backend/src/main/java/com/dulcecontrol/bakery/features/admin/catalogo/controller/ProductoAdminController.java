package com.dulcecontrol.bakery.features.admin.catalogo.controller;

import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoResponse;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.service.IProductoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/catalogo/productos")
@RequiredArgsConstructor
@Validated
public class ProductoAdminController {

    private final IProductoAdminService productoAdminService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> listar(@PathVariable Long tiendaId,
                                                         @RequestParam(value = "categoriaId", required = false) Long categoriaId) {
        return ResponseEntity.ok(productoAdminService.listar(tiendaId, categoriaId));
    }

    @GetMapping("/{productoId}")
    public ResponseEntity<ProductoResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long productoId) {
        return ResponseEntity.ok(productoAdminService.obtener(tiendaId, productoId));
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@PathVariable Long tiendaId,
                                                  @Valid @RequestBody ProductoCreateRequest request) {
        ProductoResponse response = productoAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{productoId}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long tiendaId,
                                                        @PathVariable Long productoId,
                                                        @Valid @RequestBody ProductoUpdateRequest request) {
        ProductoResponse response = productoAdminService.actualizar(tiendaId, productoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long productoId) {
        productoAdminService.eliminar(tiendaId, productoId);
        return ResponseEntity.noContent().build();
    }
}

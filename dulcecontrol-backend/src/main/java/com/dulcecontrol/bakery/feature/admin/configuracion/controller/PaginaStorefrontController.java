package com.dulcecontrol.bakery.feature.admin.configuracion.controller;

import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontCreateRequest;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontResponse;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.configuracion.service.IPaginaStorefrontService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/paginas-storefront")
@RequiredArgsConstructor
@Validated
public class PaginaStorefrontController {

    private final IPaginaStorefrontService paginaStorefrontService;

    @GetMapping
    public ResponseEntity<List<PaginaStorefrontResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(paginaStorefrontService.listarPorTienda(tiendaId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<PaginaStorefrontResponse>> buscar(@PathVariable Long tiendaId,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(paginaStorefrontService.buscarPorTiendaYTexto(tiendaId, q));
    }

    @GetMapping("/{paginaId}")
    public ResponseEntity<PaginaStorefrontResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long paginaId) {
        return ResponseEntity.ok(paginaStorefrontService.obtenerPorId(tiendaId, paginaId));
    }

    @PostMapping
    public ResponseEntity<PaginaStorefrontResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody PaginaStorefrontCreateRequest request) {
        PaginaStorefrontResponse response = paginaStorefrontService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{paginaId}")
    public ResponseEntity<PaginaStorefrontResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long paginaId,
            @Valid @RequestBody PaginaStorefrontUpdateRequest request) {
        PaginaStorefrontResponse response = paginaStorefrontService.actualizar(tiendaId, paginaId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{paginaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long paginaId) {
        paginaStorefrontService.eliminar(tiendaId, paginaId);
        return ResponseEntity.noContent().build();
    }
}
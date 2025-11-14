package com.dulcecontrol.bakery.features.admin.ventas.controller;

import com.dulcecontrol.bakery.features.admin.ventas.dto.DireccionPedidoCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.DireccionPedidoResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.DireccionPedidoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.service.IDireccionPedidoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/direcciones")
@RequiredArgsConstructor
@Validated
public class DireccionPedidoAdminController {

    private final IDireccionPedidoAdminService direccionPedidoAdminService;

    @GetMapping
    public ResponseEntity<List<DireccionPedidoResponse>> listar(@PathVariable Long tiendaId, @PathVariable Long pedidoId) {
        return ResponseEntity.ok(direccionPedidoAdminService.listar(tiendaId, pedidoId));
    }

    @GetMapping("/{direccionId}")
    public ResponseEntity<DireccionPedidoResponse> obtener(@PathVariable Long tiendaId,
                                                           @PathVariable Long pedidoId,
                                                           @PathVariable Long direccionId) {
        return ResponseEntity.ok(direccionPedidoAdminService.obtener(tiendaId, pedidoId, direccionId));
    }

    @PostMapping
    public ResponseEntity<DireccionPedidoResponse> crear(@PathVariable Long tiendaId,
                                                         @PathVariable Long pedidoId,
                                                         @Valid @RequestBody DireccionPedidoCreateRequest request) {
        DireccionPedidoResponse response = direccionPedidoAdminService.crear(tiendaId, pedidoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{direccionId}")
    public ResponseEntity<DireccionPedidoResponse> actualizar(@PathVariable Long tiendaId,
                                                              @PathVariable Long pedidoId,
                                                              @PathVariable Long direccionId,
                                                              @Valid @RequestBody DireccionPedidoUpdateRequest request) {
        DireccionPedidoResponse response = direccionPedidoAdminService.actualizar(tiendaId, pedidoId, direccionId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{direccionId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
                                         @PathVariable Long pedidoId,
                                         @PathVariable Long direccionId) {
        direccionPedidoAdminService.eliminar(tiendaId, pedidoId, direccionId);
        return ResponseEntity.noContent().build();
    }
}

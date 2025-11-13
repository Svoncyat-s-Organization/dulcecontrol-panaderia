package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IDetallePedidoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles")
@RequiredArgsConstructor
@Validated
public class DetallePedidoAdminController {

    private final IDetallePedidoAdminService detallePedidoAdminService;

    @GetMapping
    public ResponseEntity<List<DetallePedidoResponse>> listar(@PathVariable Long tiendaId, @PathVariable Long pedidoId) {
        return ResponseEntity.ok(detallePedidoAdminService.listar(tiendaId, pedidoId));
    }

    @GetMapping("/{detalleId}")
    public ResponseEntity<DetallePedidoResponse> obtener(@PathVariable Long tiendaId,
                                                         @PathVariable Long pedidoId,
                                                         @PathVariable Long detalleId) {
        return ResponseEntity.ok(detallePedidoAdminService.obtener(tiendaId, pedidoId, detalleId));
    }

    @PostMapping
    public ResponseEntity<DetallePedidoResponse> crear(@PathVariable Long tiendaId,
                                                       @PathVariable Long pedidoId,
                                                       @Valid @RequestBody DetallePedidoCreateRequest request) {
        DetallePedidoResponse response = detallePedidoAdminService.crear(tiendaId, pedidoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{detalleId}")
    public ResponseEntity<DetallePedidoResponse> actualizar(@PathVariable Long tiendaId,
                                                            @PathVariable Long pedidoId,
                                                            @PathVariable Long detalleId,
                                                            @Valid @RequestBody DetallePedidoUpdateRequest request) {
        DetallePedidoResponse response = detallePedidoAdminService.actualizar(tiendaId, pedidoId, detalleId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{detalleId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
                                         @PathVariable Long pedidoId,
                                         @PathVariable Long detalleId) {
        detallePedidoAdminService.eliminar(tiendaId, pedidoId, detalleId);
        return ResponseEntity.noContent().build();
    }
}

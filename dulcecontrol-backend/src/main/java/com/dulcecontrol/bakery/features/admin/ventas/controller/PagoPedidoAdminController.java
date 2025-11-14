package com.dulcecontrol.bakery.features.admin.ventas.controller;

import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.PagoPedidoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.service.IPagoPedidoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/pagos")
@RequiredArgsConstructor
@Validated
public class PagoPedidoAdminController {

    private final IPagoPedidoAdminService pagoPedidoAdminService;

    @GetMapping
    public ResponseEntity<List<PagoPedidoResponse>> listar(@PathVariable Long tiendaId, @PathVariable Long pedidoId) {
        return ResponseEntity.ok(pagoPedidoAdminService.listar(tiendaId, pedidoId));
    }

    @GetMapping("/{pagoId}")
    public ResponseEntity<PagoPedidoResponse> obtener(@PathVariable Long tiendaId,
                                                      @PathVariable Long pedidoId,
                                                      @PathVariable Long pagoId) {
        return ResponseEntity.ok(pagoPedidoAdminService.obtener(tiendaId, pedidoId, pagoId));
    }

    @PostMapping
    public ResponseEntity<PagoPedidoResponse> crear(@PathVariable Long tiendaId,
                                                    @PathVariable Long pedidoId,
                                                    @Valid @RequestBody PagoPedidoCreateRequest request) {
        PagoPedidoResponse response = pagoPedidoAdminService.crear(tiendaId, pedidoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{pagoId}")
    public ResponseEntity<PagoPedidoResponse> actualizar(@PathVariable Long tiendaId,
                                                         @PathVariable Long pedidoId,
                                                         @PathVariable Long pagoId,
                                                         @Valid @RequestBody PagoPedidoUpdateRequest request) {
        PagoPedidoResponse response = pagoPedidoAdminService.actualizar(tiendaId, pedidoId, pagoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pagoId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
                                         @PathVariable Long pedidoId,
                                         @PathVariable Long pagoId) {
        pagoPedidoAdminService.eliminar(tiendaId, pedidoId, pagoId);
        return ResponseEntity.noContent().build();
    }
}

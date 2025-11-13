package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoEntregaPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IPedidoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/pedidos")
@RequiredArgsConstructor
@Validated
public class PedidoAdminController {

    private final IPedidoAdminService pedidoAdminService;

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listar(@PathVariable Long tiendaId,
                                                       @RequestParam(value = "sedeId", required = false) Long sedeId,
                                                       @RequestParam(value = "estadoPedido", required = false) EstadoPedido estadoPedido,
                                                       @RequestParam(value = "estadoPago", required = false) EstadoPagoPedido estadoPago,
                                                       @RequestParam(value = "tipoEntrega", required = false) TipoEntregaPedido tipoEntrega,
                                                       @RequestParam(value = "fechaDesde", required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,
                                                       @RequestParam(value = "fechaHasta", required = false)
                                                       @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta) {
        List<PedidoResponse> pedidos = pedidoAdminService.listar(tiendaId, sedeId, estadoPedido, estadoPago, tipoEntrega, fechaDesde, fechaHasta);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{pedidoId}")
    public ResponseEntity<PedidoResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long pedidoId) {
        return ResponseEntity.ok(pedidoAdminService.obtener(tiendaId, pedidoId));
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> crear(@PathVariable Long tiendaId,
                                                @Valid @RequestBody PedidoCreateRequest request) {
        PedidoResponse response = pedidoAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{pedidoId}")
    public ResponseEntity<PedidoResponse> actualizar(@PathVariable Long tiendaId,
                                                     @PathVariable Long pedidoId,
                                                     @Valid @RequestBody PedidoUpdateRequest request) {
        PedidoResponse response = pedidoAdminService.actualizar(tiendaId, pedidoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{pedidoId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long pedidoId) {
        pedidoAdminService.eliminar(tiendaId, pedidoId);
        return ResponseEntity.noContent().build();
    }
}

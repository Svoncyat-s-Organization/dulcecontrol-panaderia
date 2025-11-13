package com.dulcecontrol.bakery.feature.admin.ventas.controller;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.service.IPersonalizacionItemPedidoAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/ventas/pedidos/{pedidoId}/detalles/{detallePedidoId}/personalizacion")
@RequiredArgsConstructor
@Validated
public class PersonalizacionItemPedidoAdminController {

    private final IPersonalizacionItemPedidoAdminService personalizacionItemPedidoAdminService;

    @GetMapping
    public ResponseEntity<PersonalizacionItemResponse> obtener(@PathVariable Long tiendaId,
                                                               @PathVariable Long pedidoId,
                                                               @PathVariable Long detallePedidoId) {
        return ResponseEntity.ok(personalizacionItemPedidoAdminService.obtener(tiendaId, pedidoId, detallePedidoId));
    }

    @PostMapping
    public ResponseEntity<PersonalizacionItemResponse> crear(@PathVariable Long tiendaId,
                                                             @PathVariable Long pedidoId,
                                                             @PathVariable Long detallePedidoId,
                                                             @Valid @RequestBody PersonalizacionItemCreateRequest request) {
        PersonalizacionItemResponse response = personalizacionItemPedidoAdminService.crear(tiendaId, pedidoId, detallePedidoId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping
    public ResponseEntity<PersonalizacionItemResponse> actualizar(@PathVariable Long tiendaId,
                                                                  @PathVariable Long pedidoId,
                                                                  @PathVariable Long detallePedidoId,
                                                                  @Valid @RequestBody PersonalizacionItemUpdateRequest request) {
        PersonalizacionItemResponse response = personalizacionItemPedidoAdminService.actualizar(tiendaId, pedidoId, detallePedidoId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
                                         @PathVariable Long pedidoId,
                                         @PathVariable Long detallePedidoId) {
        personalizacionItemPedidoAdminService.eliminar(tiendaId, pedidoId, detallePedidoId);
        return ResponseEntity.noContent().build();
    }
}

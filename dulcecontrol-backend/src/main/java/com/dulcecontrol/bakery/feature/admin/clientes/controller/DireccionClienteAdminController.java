package com.dulcecontrol.bakery.feature.admin.clientes.controller;

import com.dulcecontrol.bakery.feature.admin.clientes.dto.DireccionClienteCreateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.DireccionClienteResponse;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.DireccionClienteUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.service.IDireccionClienteAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/clientes/{clienteId}/direcciones")
@RequiredArgsConstructor
@Validated
public class DireccionClienteAdminController {

    private final IDireccionClienteAdminService direccionClienteAdminService;

    @GetMapping("/{direccionId}")
    public ResponseEntity<DireccionClienteResponse> obtener(@PathVariable Long tiendaId,
            @PathVariable Long clienteId, @PathVariable Long direccionId) {
        return ResponseEntity.ok(direccionClienteAdminService.obtenerPorId(tiendaId, clienteId, direccionId));
    }

    @PutMapping("/{direccionId}")
    public ResponseEntity<DireccionClienteResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long clienteId,
            @PathVariable Long direccionId,
            @Valid @RequestBody DireccionClienteUpdateRequest request) {
        DireccionClienteResponse response = direccionClienteAdminService.actualizar(tiendaId, clienteId, direccionId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{direccionId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId,
            @PathVariable Long clienteId, @PathVariable Long direccionId) {
        direccionClienteAdminService.eliminar(tiendaId, clienteId, direccionId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DireccionClienteResponse>> listar(@PathVariable Long tiendaId, @PathVariable Long clienteId) {
        return ResponseEntity.ok(direccionClienteAdminService.listarPorCliente(tiendaId, clienteId));
    }

    @PostMapping
    public ResponseEntity<DireccionClienteResponse> crear(@PathVariable Long tiendaId,
            @PathVariable Long clienteId,
            @Valid @RequestBody DireccionClienteCreateRequest request) {
        DireccionClienteResponse response = direccionClienteAdminService.crear(tiendaId, clienteId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
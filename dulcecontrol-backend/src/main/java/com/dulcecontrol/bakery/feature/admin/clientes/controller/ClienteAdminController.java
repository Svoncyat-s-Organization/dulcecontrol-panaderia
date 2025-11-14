package com.dulcecontrol.bakery.feature.admin.clientes.controller;

import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteCreateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteResponse;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.service.IClienteAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/tiendas/{tiendaId}/clientes")
@RequiredArgsConstructor
@Validated
public class ClienteAdminController {

    private final IClienteAdminService clienteAdminService;

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar(@PathVariable Long tiendaId) {
        return ResponseEntity.ok(clienteAdminService.listarPorTienda(tiendaId));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteResponse>> buscar(@PathVariable Long tiendaId,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(clienteAdminService.buscarPorTiendaYTexto(tiendaId, q));
    }

    @GetMapping("/{clienteId}")
    public ResponseEntity<ClienteResponse> obtener(@PathVariable Long tiendaId, @PathVariable Long clienteId) {
        return ResponseEntity.ok(clienteAdminService.obtenerPorId(tiendaId, clienteId));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> crear(@PathVariable Long tiendaId,
            @Valid @RequestBody ClienteCreateRequest request) {
        ClienteResponse response = clienteAdminService.crear(tiendaId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{clienteId}")
    public ResponseEntity<ClienteResponse> actualizar(@PathVariable Long tiendaId,
            @PathVariable Long clienteId,
            @Valid @RequestBody ClienteUpdateRequest request) {
        ClienteResponse response = clienteAdminService.actualizar(tiendaId, clienteId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{clienteId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long tiendaId, @PathVariable Long clienteId) {
        clienteAdminService.eliminar(tiendaId, clienteId);
        return ResponseEntity.noContent().build();
    }
}
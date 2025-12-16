package com.dulcecontrol.bakery.features.storefront.controller;

import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoCreateRequest;
import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoResponse;
import com.dulcecontrol.bakery.features.storefront.service.IPedidoPersonalizadoStorefrontService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/storefront")
@RequiredArgsConstructor
@Validated
public class PedidoPersonalizadoStorefrontController {

    private final IPedidoPersonalizadoStorefrontService pedidoPersonalizadoService;

    @PostMapping("/pedidos-personalizados")
    public ResponseEntity<PedidoPersonalizadoResponse> crear(
            Authentication authentication,
            @Valid @RequestBody PedidoPersonalizadoCreateRequest request) {
        
        Long clienteId = Long.parseLong(authentication.getName());
        PedidoPersonalizadoResponse response = pedidoPersonalizadoService.crear(clienteId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/pedidos/me")
    public ResponseEntity<List<PedidoPersonalizadoResponse>> listarMisPedidos(Authentication authentication) {
        Long clienteId = Long.parseLong(authentication.getName());
        List<PedidoPersonalizadoResponse> pedidos = pedidoPersonalizadoService.listarPorCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }
}

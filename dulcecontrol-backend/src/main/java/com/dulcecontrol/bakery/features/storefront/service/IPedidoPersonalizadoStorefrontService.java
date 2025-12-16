package com.dulcecontrol.bakery.features.storefront.service;

import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoCreateRequest;
import com.dulcecontrol.bakery.features.storefront.dto.PedidoPersonalizadoResponse;

import java.util.List;

public interface IPedidoPersonalizadoStorefrontService {
    
    PedidoPersonalizadoResponse crear(Long clienteId, PedidoPersonalizadoCreateRequest request);
    
    List<PedidoPersonalizadoResponse> listarPorCliente(Long clienteId);
}

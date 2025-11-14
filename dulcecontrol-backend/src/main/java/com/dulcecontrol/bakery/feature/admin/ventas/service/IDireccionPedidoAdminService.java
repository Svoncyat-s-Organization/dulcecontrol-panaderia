package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.DireccionPedidoUpdateRequest;

import java.util.List;

public interface IDireccionPedidoAdminService {

    List<DireccionPedidoResponse> listar(Long tiendaId, Long pedidoId);

    DireccionPedidoResponse obtener(Long tiendaId, Long pedidoId, Long direccionId);

    DireccionPedidoResponse crear(Long tiendaId, Long pedidoId, DireccionPedidoCreateRequest request);

    DireccionPedidoResponse actualizar(Long tiendaId, Long pedidoId, Long direccionId, DireccionPedidoUpdateRequest request);

    void eliminar(Long tiendaId, Long pedidoId, Long direccionId);
}

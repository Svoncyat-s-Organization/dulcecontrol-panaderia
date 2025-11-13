package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PagoPedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PagoPedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PagoPedidoUpdateRequest;

import java.util.List;

public interface IPagoPedidoAdminService {

    List<PagoPedidoResponse> listar(Long tiendaId, Long pedidoId);

    PagoPedidoResponse obtener(Long tiendaId, Long pedidoId, Long pagoId);

    PagoPedidoResponse crear(Long tiendaId, Long pedidoId, PagoPedidoCreateRequest request);

    PagoPedidoResponse actualizar(Long tiendaId, Long pedidoId, Long pagoId, PagoPedidoUpdateRequest request);

    void eliminar(Long tiendaId, Long pedidoId, Long pagoId);
}

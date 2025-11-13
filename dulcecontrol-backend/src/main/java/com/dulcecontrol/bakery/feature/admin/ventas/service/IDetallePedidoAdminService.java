package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.DetallePedidoUpdateRequest;

import java.util.List;

public interface IDetallePedidoAdminService {

    List<DetallePedidoResponse> listar(Long tiendaId, Long pedidoId);

    DetallePedidoResponse obtener(Long tiendaId, Long pedidoId, Long detalleId);

    DetallePedidoResponse crear(Long tiendaId, Long pedidoId, DetallePedidoCreateRequest request);

    DetallePedidoResponse actualizar(Long tiendaId, Long pedidoId, Long detalleId, DetallePedidoUpdateRequest request);

    void eliminar(Long tiendaId, Long pedidoId, Long detalleId);
}

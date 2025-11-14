package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.PedidoUpdateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPagoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.EstadoPedido;
import com.dulcecontrol.bakery.feature.admin.ventas.entity.enums.TipoEntregaPedido;

import java.time.LocalDateTime;
import java.util.List;

public interface IPedidoAdminService {

    List<PedidoResponse> listar(Long tiendaId,
                                Long sedeId,
                                EstadoPedido estadoPedido,
                                EstadoPagoPedido estadoPago,
                                TipoEntregaPedido tipoEntrega,
                                LocalDateTime fechaDesde,
                                LocalDateTime fechaHasta);

    PedidoResponse obtener(Long tiendaId, Long pedidoId);

    PedidoResponse crear(Long tiendaId, PedidoCreateRequest request);

    PedidoResponse actualizar(Long tiendaId, Long pedidoId, PedidoUpdateRequest request);

    void eliminar(Long tiendaId, Long pedidoId);
}

package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.controller.dto.PersonalizacionItemUpdateRequest;

public interface IPersonalizacionItemPedidoAdminService {

    PersonalizacionItemResponse obtener(Long tiendaId, Long pedidoId, Long detallePedidoId);

    PersonalizacionItemResponse crear(Long tiendaId, Long pedidoId, Long detallePedidoId, PersonalizacionItemCreateRequest request);

    PersonalizacionItemResponse actualizar(Long tiendaId, Long pedidoId, Long detallePedidoId, PersonalizacionItemUpdateRequest request);

    void eliminar(Long tiendaId, Long pedidoId, Long detallePedidoId);
}

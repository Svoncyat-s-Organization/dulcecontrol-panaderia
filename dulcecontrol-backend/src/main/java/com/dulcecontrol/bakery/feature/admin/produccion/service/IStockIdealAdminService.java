package com.dulcecontrol.bakery.feature.admin.produccion.service;

import com.dulcecontrol.bakery.feature.admin.produccion.controller.dto.StockIdealCreateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.controller.dto.StockIdealResponse;
import com.dulcecontrol.bakery.feature.admin.produccion.controller.dto.StockIdealUpdateRequest;
import java.util.List;

public interface IStockIdealAdminService {

    List<StockIdealResponse> listarPorTienda(Long tiendaId, Long sedeId);

    StockIdealResponse obtenerPorId(Long tiendaId, Long stockId);

    StockIdealResponse crear(Long tiendaId, StockIdealCreateRequest request);

    StockIdealResponse actualizar(Long tiendaId, Long stockId, StockIdealUpdateRequest request);

    void eliminar(Long tiendaId, Long stockId);
}

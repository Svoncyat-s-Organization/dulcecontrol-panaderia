package com.dulcecontrol.bakery.features.admin.compras.service;

import com.dulcecontrol.bakery.features.admin.compras.dto.InsumoCreateRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.InsumoResponse;
import com.dulcecontrol.bakery.features.admin.compras.dto.InsumoUpdateRequest;

import java.util.List;

public interface IInsumoService {

    List<InsumoResponse> listarPorTienda(Long tiendaId);

    List<InsumoResponse> listarActivos(Long tiendaId);

    List<InsumoResponse> listarConStockBajo(Long tiendaId);

    InsumoResponse obtenerPorId(Long tiendaId, Long insumoId);

    InsumoResponse crear(InsumoCreateRequest request);

    InsumoResponse actualizar(Long tiendaId, Long insumoId, InsumoUpdateRequest request);

    void eliminar(Long tiendaId, Long insumoId);

    void desactivar(Long tiendaId, Long insumoId);

    void reactivar(Long tiendaId, Long insumoId);
}

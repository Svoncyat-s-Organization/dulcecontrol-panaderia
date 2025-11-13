package com.dulcecontrol.bakery.feature.admin.compras.service;

import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.ProveedorCreateRequest;
import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.ProveedorResponse;
import com.dulcecontrol.bakery.feature.admin.compras.controller.dto.ProveedorUpdateRequest;

import java.util.List;

public interface IProveedorService {

    List<ProveedorResponse> listarPorTienda(Long tiendaId);

    List<ProveedorResponse> listarActivos(Long tiendaId);

    ProveedorResponse obtenerPorId(Long tiendaId, Long proveedorId);

    ProveedorResponse crear(ProveedorCreateRequest request);

    ProveedorResponse actualizar(Long tiendaId, Long proveedorId, ProveedorUpdateRequest request);

    void eliminar(Long tiendaId, Long proveedorId);
}

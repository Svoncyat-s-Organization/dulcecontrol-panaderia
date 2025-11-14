package com.dulcecontrol.bakery.features.superadmin.tiendas.service;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.TiendaUpdateRequest;

import java.util.List;

public interface ITiendaSuperAdminService {

    List<TiendaResponse> listar();

    TiendaResponse obtenerPorId(Long tiendaId);

    TiendaResponse crear(TiendaCreateRequest request);

    TiendaResponse actualizar(Long tiendaId, TiendaUpdateRequest request);

    void eliminar(Long tiendaId);
}

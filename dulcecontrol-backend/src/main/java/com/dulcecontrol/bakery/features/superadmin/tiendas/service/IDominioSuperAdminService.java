package com.dulcecontrol.bakery.features.superadmin.tiendas.service;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.DominioUpdateRequest;

import java.util.List;

public interface IDominioSuperAdminService {

    List<DominioResponse> listarPorTienda(Long tiendaId);

    DominioResponse obtenerPorId(Long tiendaId, Long dominioId);

    DominioResponse crear(Long tiendaId, DominioCreateRequest request);

    DominioResponse actualizar(Long tiendaId, Long dominioId, DominioUpdateRequest request);

    void eliminar(Long tiendaId, Long dominioId);
}

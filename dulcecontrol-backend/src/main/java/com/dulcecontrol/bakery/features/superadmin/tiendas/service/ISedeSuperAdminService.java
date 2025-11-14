package com.dulcecontrol.bakery.features.superadmin.tiendas.service;

import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeResponse;
import com.dulcecontrol.bakery.features.superadmin.tiendas.dto.SedeUpdateRequest;

import java.util.List;

public interface ISedeSuperAdminService {

    List<SedeResponse> listarPorTienda(Long tiendaId);

    SedeResponse obtenerPorId(Long tiendaId, Long sedeId);

    SedeResponse crear(Long tiendaId, SedeCreateRequest request);

    SedeResponse actualizar(Long tiendaId, Long sedeId, SedeUpdateRequest request);

    void eliminar(Long tiendaId, Long sedeId);
}

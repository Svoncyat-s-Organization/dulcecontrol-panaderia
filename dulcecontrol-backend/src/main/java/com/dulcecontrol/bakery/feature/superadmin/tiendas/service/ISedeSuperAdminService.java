package com.dulcecontrol.bakery.feature.superadmin.tiendas.service;

import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeResponse;
import com.dulcecontrol.bakery.feature.superadmin.tiendas.controller.dto.SedeUpdateRequest;

import java.util.List;

public interface ISedeSuperAdminService {

    List<SedeResponse> listarPorTienda(Long tiendaId);

    SedeResponse obtenerPorId(Long tiendaId, Long sedeId);

    SedeResponse crear(Long tiendaId, SedeCreateRequest request);

    SedeResponse actualizar(Long tiendaId, Long sedeId, SedeUpdateRequest request);

    void eliminar(Long tiendaId, Long sedeId);
}

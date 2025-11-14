package com.dulcecontrol.bakery.feature.admin.seguridad.service;

import com.dulcecontrol.bakery.feature.admin.seguridad.dto.RolCreateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.dto.RolResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.dto.RolUpdateRequest;

import java.util.List;

public interface IRolAdminService {

    List<RolResponse> listarPorTienda(Long tiendaId);

    RolResponse obtenerPorId(Long tiendaId, Long rolId);

    RolResponse crear(Long tiendaId, RolCreateRequest request);

    RolResponse actualizar(Long tiendaId, Long rolId, RolUpdateRequest request);

    void eliminar(Long tiendaId, Long rolId);
}

package com.dulcecontrol.bakery.features.superadmin.seguridad.service;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.RolSuperadminUpdateRequest;

import java.util.List;

public interface IRolSuperadminService {

    List<RolSuperadminResponse> listar();

    RolSuperadminResponse obtener(Long id);

    RolSuperadminResponse crear(RolSuperadminCreateRequest request);

    RolSuperadminResponse actualizar(Long id, RolSuperadminUpdateRequest request);

    void eliminar(Long id);
}

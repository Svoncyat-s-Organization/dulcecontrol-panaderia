package com.dulcecontrol.bakery.features.superadmin.seguridad.service;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.PermisoSuperadminResponse;

import java.util.List;

public interface IPermisoSuperadminService {

    List<PermisoSuperadminResponse> listar();
}

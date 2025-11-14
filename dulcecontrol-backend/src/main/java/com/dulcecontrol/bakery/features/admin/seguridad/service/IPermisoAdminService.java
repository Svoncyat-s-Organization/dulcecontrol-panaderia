package com.dulcecontrol.bakery.features.admin.seguridad.service;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.PermisoResponse;

import java.util.List;

public interface IPermisoAdminService {

    List<PermisoResponse> listarTodos();
}

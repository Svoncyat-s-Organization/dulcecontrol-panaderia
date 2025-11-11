package com.dulcecontrol.bakery.feature.admin.seguridad.service;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.PermisoResponse;

import java.util.List;

public interface IPermisoAdminService {

    List<PermisoResponse> listarTodos();
}

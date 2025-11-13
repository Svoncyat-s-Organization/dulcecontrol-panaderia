package com.dulcecontrol.bakery.feature.superadmin.seguridad.service;

import com.dulcecontrol.bakery.feature.superadmin.seguridad.controller.dto.ActividadSuperadminCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.seguridad.controller.dto.ActividadSuperadminResponse;

import java.util.List;

public interface IActividadSuperadminService {

    List<ActividadSuperadminResponse> listarRecientes(int limite);

    List<ActividadSuperadminResponse> listarPorSuperadmin(Long superadminId, int limite);

    ActividadSuperadminResponse registrar(Long superadminId, ActividadSuperadminCreateRequest request);
}

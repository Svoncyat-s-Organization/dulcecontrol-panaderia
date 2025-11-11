package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.PlanUpdateRequest;

import java.util.List;

public interface IPlanSuperadminService {

    List<PlanResponse> listar(Boolean soloActivos);

    PlanResponse obtener(Long id);

    PlanResponse crear(PlanCreateRequest request);

    PlanResponse actualizar(Long id, PlanUpdateRequest request);
}

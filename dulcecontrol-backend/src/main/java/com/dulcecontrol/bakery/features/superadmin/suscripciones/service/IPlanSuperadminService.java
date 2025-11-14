package com.dulcecontrol.bakery.features.superadmin.suscripciones.service;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanResponse;
import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.PlanUpdateRequest;

import java.util.List;

public interface IPlanSuperadminService {

    List<PlanResponse> listar(Boolean soloActivos);

    PlanResponse obtener(Long id);

    PlanResponse crear(PlanCreateRequest request);

    PlanResponse actualizar(Long id, PlanUpdateRequest request);
}

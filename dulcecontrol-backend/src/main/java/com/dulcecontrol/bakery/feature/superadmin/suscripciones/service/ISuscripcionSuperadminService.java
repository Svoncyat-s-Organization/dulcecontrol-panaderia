package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionResponse;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.SuscripcionUpdateRequest;
import com.dulcecontrol.bakery.feature.superadmin.suscripciones.entity.enums.EstadoSuscripcion;

import java.util.List;

public interface ISuscripcionSuperadminService {

    List<SuscripcionResponse> listar(Long tiendaId, EstadoSuscripcion estado);

    SuscripcionResponse obtener(Long id);

    SuscripcionResponse crear(SuscripcionCreateRequest request);

    SuscripcionResponse actualizar(Long id, SuscripcionUpdateRequest request);
}

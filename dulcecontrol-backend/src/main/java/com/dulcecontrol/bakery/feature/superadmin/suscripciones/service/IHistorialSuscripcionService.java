package com.dulcecontrol.bakery.feature.superadmin.suscripciones.service;

import com.dulcecontrol.bakery.feature.superadmin.suscripciones.controller.dto.HistorialSuscripcionResponse;

import java.util.List;

public interface IHistorialSuscripcionService {

    List<HistorialSuscripcionResponse> listarPorSuscripcion(Long suscripcionId);
}

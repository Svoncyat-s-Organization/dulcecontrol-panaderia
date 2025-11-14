package com.dulcecontrol.bakery.features.superadmin.suscripciones.service;

import com.dulcecontrol.bakery.features.superadmin.suscripciones.dto.HistorialSuscripcionResponse;

import java.util.List;

public interface IHistorialSuscripcionService {

    List<HistorialSuscripcionResponse> listarPorSuscripcion(Long suscripcionId);
}

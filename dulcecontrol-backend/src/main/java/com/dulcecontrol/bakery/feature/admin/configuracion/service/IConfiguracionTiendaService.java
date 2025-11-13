package com.dulcecontrol.bakery.feature.admin.configuracion.service;

import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.ConfiguracionTiendaResponse;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.ConfiguracionTiendaUpdateRequest;

public interface IConfiguracionTiendaService {

    ConfiguracionTiendaResponse obtenerPorTiendaId(Long tiendaId);

    ConfiguracionTiendaResponse actualizar(Long tiendaId, ConfiguracionTiendaUpdateRequest request);
}
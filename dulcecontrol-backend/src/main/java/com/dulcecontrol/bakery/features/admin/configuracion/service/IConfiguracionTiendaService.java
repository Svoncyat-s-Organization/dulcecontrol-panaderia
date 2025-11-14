package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionTiendaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.ConfiguracionTiendaUpdateRequest;

public interface IConfiguracionTiendaService {

    ConfiguracionTiendaResponse obtenerPorTiendaId(Long tiendaId);

    ConfiguracionTiendaResponse actualizar(Long tiendaId, ConfiguracionTiendaUpdateRequest request);
}
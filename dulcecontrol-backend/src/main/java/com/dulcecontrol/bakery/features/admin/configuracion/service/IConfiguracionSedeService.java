package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.SedeResumenResponse;

import java.util.List;

public interface IConfiguracionSedeService {

    List<SedeResumenResponse> listarAsignadas(Long tiendaId);
}

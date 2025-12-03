package com.dulcecontrol.bakery.features.admin.tablero.service;

import com.dulcecontrol.bakery.features.admin.tablero.dto.TableroAdminResponse;

public interface ITableroAdminService {
    TableroAdminResponse obtenerEstadisticas(Long tiendaId, Long sedeId);
}

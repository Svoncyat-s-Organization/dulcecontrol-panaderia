package com.dulcecontrol.bakery.feature.admin.produccion.service;

import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaResponse;
import com.dulcecontrol.bakery.feature.admin.produccion.dto.RecetaUpdateRequest;
import java.util.List;

public interface IRecetaAdminService {

    List<RecetaResponse> listarPorTienda(Long tiendaId);

    RecetaResponse obtenerPorId(Long tiendaId, Long recetaId);

    RecetaResponse crear(Long tiendaId, RecetaCreateRequest request);

    RecetaResponse actualizar(Long tiendaId, Long recetaId, RecetaUpdateRequest request);

    void eliminar(Long tiendaId, Long recetaId);
}

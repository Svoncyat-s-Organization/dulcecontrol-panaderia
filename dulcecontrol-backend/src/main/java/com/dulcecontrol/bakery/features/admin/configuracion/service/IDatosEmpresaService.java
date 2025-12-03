package com.dulcecontrol.bakery.features.admin.configuracion.service;

import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaResponse;
import com.dulcecontrol.bakery.features.admin.configuracion.dto.DatosEmpresaUpdateRequest;

public interface IDatosEmpresaService {

    DatosEmpresaResponse obtenerPorTiendaId(Long tiendaId);

    DatosEmpresaResponse actualizar(Long tiendaId, DatosEmpresaUpdateRequest request);
}

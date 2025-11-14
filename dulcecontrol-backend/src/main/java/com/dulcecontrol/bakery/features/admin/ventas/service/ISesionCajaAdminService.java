package com.dulcecontrol.bakery.features.admin.ventas.service;

import com.dulcecontrol.bakery.features.admin.ventas.dto.SesionCajaCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.SesionCajaResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.SesionCajaUpdateRequest;

import java.util.List;

public interface ISesionCajaAdminService {

    List<SesionCajaResponse> listar(Long tiendaId, Long cajaId, Boolean estaAbierta);

    SesionCajaResponse obtener(Long tiendaId, Long sesionId);

    SesionCajaResponse crear(Long tiendaId, SesionCajaCreateRequest request);

    SesionCajaResponse actualizar(Long tiendaId, Long sesionId, SesionCajaUpdateRequest request);

    void eliminar(Long tiendaId, Long sesionId);
}

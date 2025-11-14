package com.dulcecontrol.bakery.features.admin.ventas.service;

import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaCreateRequest;
import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaResponse;
import com.dulcecontrol.bakery.features.admin.ventas.dto.CajaUpdateRequest;

import java.util.List;

public interface ICajaAdminService {

    List<CajaResponse> listar(Long tiendaId, Long sedeId);

    CajaResponse obtener(Long tiendaId, Long cajaId);

    CajaResponse crear(Long tiendaId, CajaCreateRequest request);

    CajaResponse actualizar(Long tiendaId, Long cajaId, CajaUpdateRequest request);

    void eliminar(Long tiendaId, Long cajaId);
}

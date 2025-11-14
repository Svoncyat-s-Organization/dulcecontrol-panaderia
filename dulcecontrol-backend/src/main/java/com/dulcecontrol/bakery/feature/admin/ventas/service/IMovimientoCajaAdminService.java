package com.dulcecontrol.bakery.feature.admin.ventas.service;

import com.dulcecontrol.bakery.feature.admin.ventas.dto.MovimientoCajaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.MovimientoCajaResponse;
import com.dulcecontrol.bakery.feature.admin.ventas.dto.MovimientoCajaUpdateRequest;

import java.util.List;

public interface IMovimientoCajaAdminService {

    List<MovimientoCajaResponse> listar(Long tiendaId, Long sesionCajaId);

    MovimientoCajaResponse obtener(Long tiendaId, Long sesionCajaId, Long movimientoId);

    MovimientoCajaResponse crear(Long tiendaId, Long sesionCajaId, MovimientoCajaCreateRequest request);

    MovimientoCajaResponse actualizar(Long tiendaId, Long sesionCajaId, Long movimientoId, MovimientoCajaUpdateRequest request);

    void eliminar(Long tiendaId, Long sesionCajaId, Long movimientoId);
}

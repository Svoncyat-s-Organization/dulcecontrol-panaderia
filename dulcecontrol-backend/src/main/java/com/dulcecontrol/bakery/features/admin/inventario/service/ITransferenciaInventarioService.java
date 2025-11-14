package com.dulcecontrol.bakery.features.admin.inventario.service;

import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.TransferenciaInventarioResponse;
import com.dulcecontrol.bakery.features.admin.inventario.entity.enums.EstadoTransferencia;

import java.util.List;

public interface ITransferenciaInventarioService {

    List<TransferenciaInventarioResponse> listarPorTienda(Long tiendaId);

    List<TransferenciaInventarioResponse> listarPorEstado(Long tiendaId, EstadoTransferencia estado);

    TransferenciaInventarioResponse obtenerPorId(Long tiendaId, Long id);

    TransferenciaInventarioResponse crear(Long tiendaId, TransferenciaInventarioCreateRequest request);

    TransferenciaInventarioResponse actualizar(Long tiendaId, Long id, TransferenciaInventarioUpdateRequest request);

    TransferenciaInventarioResponse cambiarEstado(Long tiendaId, Long id, EstadoTransferencia nuevoEstado);

    void eliminar(Long tiendaId, Long id);
}

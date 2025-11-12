package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.TransferenciaInventarioDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.EstadoTransferencia;

import java.util.List;

public interface ITransferenciaInventarioService {

    List<TransferenciaInventarioDTO> listarPorTienda(Long tiendaId);

    List<TransferenciaInventarioDTO> listarPorEstado(Long tiendaId, EstadoTransferencia estado);

    TransferenciaInventarioDTO obtenerPorId(Long tiendaId, Long id);

    TransferenciaInventarioDTO crear(Long tiendaId, TransferenciaInventarioDTO dto);

    TransferenciaInventarioDTO actualizar(Long tiendaId, Long id, TransferenciaInventarioDTO dto);

    TransferenciaInventarioDTO cambiarEstado(Long tiendaId, Long id, EstadoTransferencia nuevoEstado);

    void eliminar(Long tiendaId, Long id);
}

package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.InventarioProductoDTO;

import java.util.List;

public interface IInventarioProductoService {

    List<InventarioProductoDTO> listarPorTienda(Long tiendaId);

    List<InventarioProductoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    InventarioProductoDTO obtenerPorId(Long tiendaId, Long id);

    InventarioProductoDTO crear(Long tiendaId, InventarioProductoDTO dto);

    InventarioProductoDTO actualizar(Long tiendaId, Long id, InventarioProductoDTO dto);

    void eliminar(Long tiendaId, Long id);

    List<InventarioProductoDTO> listarBajoStock(Long tiendaId, Long sedeId, Integer cantidadMinima);
}

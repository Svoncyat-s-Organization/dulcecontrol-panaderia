package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioProductoDTO;
import java.util.List;

public interface IInventarioProductoService {
    List<InventarioProductoDTO> obtenerTodos();

    InventarioProductoDTO obtenerPorId(Long id);

    List<InventarioProductoDTO> obtenerPorTienda(Long tiendaId);

    List<InventarioProductoDTO> obtenerPorSede(Long sedeId);

    InventarioProductoDTO obtenerPorSedeYProducto(Long sedeId, Long productoId);

    InventarioProductoDTO crear(InventarioProductoDTO dto);

    InventarioProductoDTO actualizar(Long id, InventarioProductoDTO dto);

    void eliminar(Long id);

    List<InventarioProductoDTO> obtenerInventarioBajo(Long sedeId, Integer cantidadMinima);

    List<InventarioProductoDTO> obtenerProductosAgotados(Long sedeId);
}

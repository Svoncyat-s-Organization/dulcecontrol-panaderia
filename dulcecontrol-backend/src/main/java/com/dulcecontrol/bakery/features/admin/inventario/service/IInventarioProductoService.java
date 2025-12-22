package com.dulcecontrol.bakery.features.admin.inventario.service;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioProductoResponse;
import com.dulcecontrol.bakery.features.admin.inventario.dto.UbicacionFisicaUpdateRequest;

import java.util.List;

public interface IInventarioProductoService {

    List<InventarioProductoResponse> listarPorTienda(Long tiendaId);

    List<InventarioProductoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    InventarioProductoResponse obtenerPorId(Long tiendaId, Long id);

    InventarioProductoResponse crear(Long tiendaId, InventarioProductoCreateRequest request);

    InventarioProductoResponse actualizar(Long tiendaId, Long id, InventarioProductoUpdateRequest request);

    InventarioProductoResponse actualizarUbicacion(Long tiendaId, Long id, UbicacionFisicaUpdateRequest request);

    void eliminar(Long tiendaId, Long id);

    List<InventarioProductoResponse> listarBajoStock(Long tiendaId, Long sedeId, Integer cantidadMinima);
}

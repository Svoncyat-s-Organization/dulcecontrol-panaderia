package com.dulcecontrol.bakery.features.admin.inventario.service;

import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeUpdateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.InventarioInsumoSedeResponse;

import java.math.BigDecimal;
import java.util.List;

public interface IInventarioInsumoSedeService {

    List<InventarioInsumoSedeResponse> listarPorTienda(Long tiendaId);

    List<InventarioInsumoSedeResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    InventarioInsumoSedeResponse obtenerPorId(Long tiendaId, Long id);

    InventarioInsumoSedeResponse crear(Long tiendaId, InventarioInsumoSedeCreateRequest request);

    InventarioInsumoSedeResponse actualizar(Long tiendaId, Long id, InventarioInsumoSedeUpdateRequest request);

    void eliminar(Long tiendaId, Long id);

    List<InventarioInsumoSedeResponse> listarBajoStock(Long tiendaId, Long sedeId, BigDecimal cantidadMinima);
}

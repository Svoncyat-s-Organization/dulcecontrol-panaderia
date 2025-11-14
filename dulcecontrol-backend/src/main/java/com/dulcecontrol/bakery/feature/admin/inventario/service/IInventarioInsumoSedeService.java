package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.InventarioInsumoSedeDTO;

import java.math.BigDecimal;
import java.util.List;

public interface IInventarioInsumoSedeService {

    List<InventarioInsumoSedeDTO> listarPorTienda(Long tiendaId);

    List<InventarioInsumoSedeDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    InventarioInsumoSedeDTO obtenerPorId(Long tiendaId, Long id);

    InventarioInsumoSedeDTO crear(Long tiendaId, InventarioInsumoSedeDTO dto);

    InventarioInsumoSedeDTO actualizar(Long tiendaId, Long id, InventarioInsumoSedeDTO dto);

    void eliminar(Long tiendaId, Long id);

    List<InventarioInsumoSedeDTO> listarBajoStock(Long tiendaId, Long sedeId, BigDecimal cantidadMinima);
}

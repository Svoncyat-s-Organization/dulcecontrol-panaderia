package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.InventarioInsumoSedeDTO;
import java.math.BigDecimal;
import java.util.List;

public interface IInventarioInsumoSedeService {
    List<InventarioInsumoSedeDTO> obtenerTodos();

    InventarioInsumoSedeDTO obtenerPorId(Long id);

    List<InventarioInsumoSedeDTO> obtenerPorTienda(Long tiendaId);

    List<InventarioInsumoSedeDTO> obtenerPorSede(Long sedeId);

    InventarioInsumoSedeDTO obtenerPorSedeEInsumo(Long sedeId, Long insumoId);

    InventarioInsumoSedeDTO crear(InventarioInsumoSedeDTO dto);

    InventarioInsumoSedeDTO actualizar(Long id, InventarioInsumoSedeDTO dto);

    void eliminar(Long id);

    List<InventarioInsumoSedeDTO> obtenerInventarioBajo(Long sedeId, BigDecimal cantidadMinima);
}

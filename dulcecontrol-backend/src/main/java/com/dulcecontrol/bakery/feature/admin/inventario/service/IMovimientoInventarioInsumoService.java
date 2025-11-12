package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioInsumoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.TipoMovimientoInsumo;
import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioInsumoService {
    List<MovimientoInventarioInsumoDTO> obtenerTodos();

    MovimientoInventarioInsumoDTO obtenerPorId(Long id);

    List<MovimientoInventarioInsumoDTO> obtenerPorTienda(Long tiendaId);

    List<MovimientoInventarioInsumoDTO> obtenerPorSede(Long sedeId);

    List<MovimientoInventarioInsumoDTO> obtenerPorInsumo(Long insumoId);

    List<MovimientoInventarioInsumoDTO> obtenerPorSedeEInsumo(Long sedeId, Long insumoId);

    List<MovimientoInventarioInsumoDTO> obtenerPorTipoMovimiento(Long tiendaId, TipoMovimientoInsumo tipoMovimiento);

    MovimientoInventarioInsumoDTO crear(MovimientoInventarioInsumoDTO dto);

    List<MovimientoInventarioInsumoDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}

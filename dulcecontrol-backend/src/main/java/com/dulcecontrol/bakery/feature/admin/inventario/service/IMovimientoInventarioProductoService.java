package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioProductoDTO;
import com.dulcecontrol.bakery.feature.admin.inventario.entity.enums.MotivoMovimientoProducto;
import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioProductoService {
    List<MovimientoInventarioProductoDTO> obtenerTodos();

    MovimientoInventarioProductoDTO obtenerPorId(Long id);

    List<MovimientoInventarioProductoDTO> obtenerPorTienda(Long tiendaId);

    List<MovimientoInventarioProductoDTO> obtenerPorSede(Long sedeId);

    List<MovimientoInventarioProductoDTO> obtenerPorProducto(Long productoId);

    List<MovimientoInventarioProductoDTO> obtenerPorSedeYProducto(Long sedeId, Long productoId);

    List<MovimientoInventarioProductoDTO> obtenerPorMotivo(Long tiendaId, MotivoMovimientoProducto motivo);

    MovimientoInventarioProductoDTO crear(MovimientoInventarioProductoDTO dto);

    List<MovimientoInventarioProductoDTO> obtenerPorRangoFechas(LocalDateTime fechaInicio, LocalDateTime fechaFin);
}

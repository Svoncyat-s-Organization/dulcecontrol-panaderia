package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.MovimientoInventarioProductoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioProductoService {

    List<MovimientoInventarioProductoDTO> listarPorTienda(Long tiendaId);

    List<MovimientoInventarioProductoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioProductoDTO> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId, Pageable pageable);

    MovimientoInventarioProductoDTO obtenerPorId(Long tiendaId, Long id);

    MovimientoInventarioProductoDTO crear(Long tiendaId, MovimientoInventarioProductoDTO dto);

    List<MovimientoInventarioProductoDTO> listarPorProducto(Long tiendaId, Long sedeId, Long productoId);

    List<MovimientoInventarioProductoDTO> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);
}

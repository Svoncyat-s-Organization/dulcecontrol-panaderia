package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.dto.MovimientoInventarioProductoCreateRequest;
import com.dulcecontrol.bakery.feature.admin.inventario.dto.MovimientoInventarioProductoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioProductoService {

    List<MovimientoInventarioProductoResponse> listarPorTienda(Long tiendaId);

    List<MovimientoInventarioProductoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioProductoResponse> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable);

    MovimientoInventarioProductoResponse obtenerPorId(Long tiendaId, Long id);

    MovimientoInventarioProductoResponse crear(Long tiendaId, MovimientoInventarioProductoCreateRequest request);

    List<MovimientoInventarioProductoResponse> listarPorProducto(Long tiendaId, Long sedeId, Long productoId);

    List<MovimientoInventarioProductoResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin);
}

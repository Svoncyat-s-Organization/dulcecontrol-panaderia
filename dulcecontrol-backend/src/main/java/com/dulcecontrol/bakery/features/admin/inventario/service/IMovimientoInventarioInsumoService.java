package com.dulcecontrol.bakery.features.admin.inventario.service;

import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoCreateRequest;
import com.dulcecontrol.bakery.features.admin.inventario.dto.MovimientoInventarioInsumoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioInsumoService {

    List<MovimientoInventarioInsumoResponse> listarPorTienda(Long tiendaId);

    List<MovimientoInventarioInsumoResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioInsumoResponse> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId,
            Pageable pageable);

    MovimientoInventarioInsumoResponse obtenerPorId(Long tiendaId, Long id);

    MovimientoInventarioInsumoResponse crear(Long tiendaId, MovimientoInventarioInsumoCreateRequest request);

    List<MovimientoInventarioInsumoResponse> listarPorInsumo(Long tiendaId, Long sedeId, Long insumoId);

    List<MovimientoInventarioInsumoResponse> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio,
            LocalDateTime fin);
}

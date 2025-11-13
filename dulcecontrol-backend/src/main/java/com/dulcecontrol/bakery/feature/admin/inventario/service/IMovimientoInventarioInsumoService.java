package com.dulcecontrol.bakery.feature.admin.inventario.service;

import com.dulcecontrol.bakery.feature.admin.inventario.controller.dto.MovimientoInventarioInsumoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface IMovimientoInventarioInsumoService {

    List<MovimientoInventarioInsumoDTO> listarPorTienda(Long tiendaId);

    List<MovimientoInventarioInsumoDTO> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    Page<MovimientoInventarioInsumoDTO> listarPorTiendaYSedePaginado(Long tiendaId, Long sedeId, Pageable pageable);

    MovimientoInventarioInsumoDTO obtenerPorId(Long tiendaId, Long id);

    MovimientoInventarioInsumoDTO crear(Long tiendaId, MovimientoInventarioInsumoDTO dto);

    List<MovimientoInventarioInsumoDTO> listarPorInsumo(Long tiendaId, Long sedeId, Long insumoId);

    List<MovimientoInventarioInsumoDTO> listarPorRangoFechas(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);
}

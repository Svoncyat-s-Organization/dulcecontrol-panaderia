package com.dulcecontrol.bakery.features.admin.facturacion.service;

import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaSerieRequest;
import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaSerieResponse;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;

import java.util.List;

public interface TiendaSerieService {

    TiendaSerieResponse crear(Long tiendaId, TiendaSerieRequest request);

    TiendaSerieResponse obtenerPorIdYTienda(Long serieId, Long tiendaId);

    List<TiendaSerieResponse> listarPorTienda(Long tiendaId);

    List<TiendaSerieResponse> listarActivasPorTienda(Long tiendaId);

    List<TiendaSerieResponse> listarPorTiendaYSede(Long tiendaId, Long sedeId);

    List<TiendaSerieResponse> listarActivasPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante);

    TiendaSerieResponse actualizar(Long tiendaId, Long serieId, TiendaSerieRequest request);

    void desactivar(Long tiendaId, Long serieId);

    void activar(Long tiendaId, Long serieId);

    Integer incrementarCorrelativo(Long tiendaId, Long serieId);
}

package com.dulcecontrol.bakery.feature.admin.facturacion.service;

import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaSerieRequest;
import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaSerieResponse;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;

import java.util.List;

public interface TiendaSerieService {

    TiendaSerieResponse crear(TiendaSerieRequest request);

    TiendaSerieResponse obtenerPorId(Long id);

    List<TiendaSerieResponse> listarPorTienda(Long tiendaId);

    List<TiendaSerieResponse> listarPorSede(Long sedeId);

    List<TiendaSerieResponse> listarActivasPorTienda(Long tiendaId);

    List<TiendaSerieResponse> listarActivasPorSede(Long sedeId);

    List<TiendaSerieResponse> listarActivasPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante);

    TiendaSerieResponse actualizar(Long id, TiendaSerieRequest request);

    void desactivar(Long id);

    void activar(Long id);

    Integer incrementarCorrelativo(Long serieId);
}

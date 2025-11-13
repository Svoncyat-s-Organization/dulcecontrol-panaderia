package com.dulcecontrol.bakery.feature.admin.facturacion.service;

import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteRequest;
import com.dulcecontrol.bakery.feature.admin.facturacion.dto.TiendaComprobanteResponse;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.feature.admin.facturacion.entity.enums.TipoComprobante;

import java.time.LocalDateTime;
import java.util.List;

public interface TiendaComprobanteService {

    TiendaComprobanteResponse crear(TiendaComprobanteRequest request);

    TiendaComprobanteResponse obtenerPorId(Long id);

    TiendaComprobanteResponse obtenerPorPedidoId(Long pedidoId);

    List<TiendaComprobanteResponse> listarPorTienda(Long tiendaId);

    List<TiendaComprobanteResponse> listarPorSerie(Long serieId);

    List<TiendaComprobanteResponse> listarPorEstado(EstadoSunat estadoSunat);

    List<TiendaComprobanteResponse> listarPorTiendaYEstado(Long tiendaId, EstadoSunat estadoSunat);

    List<TiendaComprobanteResponse> listarPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante);

    List<TiendaComprobanteResponse> listarPorCliente(String clienteNumeroDoc);

    List<TiendaComprobanteResponse> listarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);

    List<TiendaComprobanteResponse> listarPorTiendaYRangoFechas(Long tiendaId, LocalDateTime inicio, LocalDateTime fin);

    TiendaComprobanteResponse actualizar(Long id, TiendaComprobanteRequest request);

    void eliminar(Long id);

    TiendaComprobanteResponse actualizarEstadoSunat(Long id, EstadoSunat nuevoEstado, String codigoRespuesta,
            String descripcionRespuesta);

    TiendaComprobanteResponse registrarEnvioSunat(Long id, String codigoHash, String xmlUrl, String cdrUrl,
            String pdfUrl);
}

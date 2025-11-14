package com.dulcecontrol.bakery.features.admin.facturacion.service;

import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaComprobanteRequest;
import com.dulcecontrol.bakery.features.admin.facturacion.dto.TiendaComprobanteResponse;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.admin.facturacion.entity.enums.TipoComprobante;

import java.time.LocalDateTime;
import java.util.List;

public interface TiendaComprobanteService {

        TiendaComprobanteResponse crear(Long tiendaId, TiendaComprobanteRequest request);

        TiendaComprobanteResponse obtenerPorIdYTienda(Long comprobanteId, Long tiendaId);

        TiendaComprobanteResponse obtenerPorPedidoIdYTienda(Long pedidoId, Long tiendaId);

        List<TiendaComprobanteResponse> listarPorTienda(Long tiendaId);

        List<TiendaComprobanteResponse> listarPorSerie(Long serieId);

        List<TiendaComprobanteResponse> listarPorEstado(EstadoSunat estadoSunat);

        List<TiendaComprobanteResponse> listarPorTiendaYEstado(Long tiendaId, EstadoSunat estadoSunat);

        List<TiendaComprobanteResponse> listarPorTiendaYTipo(Long tiendaId, TipoComprobante tipoComprobante);

        List<TiendaComprobanteResponse> listarPorCliente(String clienteNumeroDoc);

        List<TiendaComprobanteResponse> listarPorRangoFechas(LocalDateTime inicio, LocalDateTime fin);

        List<TiendaComprobanteResponse> listarPorTiendaYRangoFechas(Long tiendaId, LocalDateTime inicio,
                        LocalDateTime fin);

        TiendaComprobanteResponse actualizar(Long tiendaId, Long comprobanteId, TiendaComprobanteRequest request);

        void eliminar(Long tiendaId, Long comprobanteId);

        TiendaComprobanteResponse actualizarEstadoSunat(Long tiendaId, Long comprobanteId, EstadoSunat nuevoEstado,
                        String codigoRespuesta, String descripcionRespuesta);

        TiendaComprobanteResponse registrarEnvioSunat(Long tiendaId, Long comprobanteId, String codigoHash,
                        String xmlUrl,
                        String cdrUrl, String pdfUrl);
}

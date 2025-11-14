package com.dulcecontrol.bakery.feature.admin.compras.service;

import com.dulcecontrol.bakery.feature.admin.compras.dto.DetalleOrdenCompraRequest;
import com.dulcecontrol.bakery.feature.admin.compras.dto.DetalleOrdenCompraResponse;

import java.util.List;

public interface IDetalleOrdenCompraService {

    DetalleOrdenCompraResponse obtenerPorId(Long id);

    List<DetalleOrdenCompraResponse> listarPorOrdenCompra(Long ordenCompraId);

    List<DetalleOrdenCompraResponse> listarPendientesPorOrdenCompra(Long ordenCompraId);

    DetalleOrdenCompraResponse crear(Long ordenCompraId, DetalleOrdenCompraRequest request);

    DetalleOrdenCompraResponse actualizar(Long id, DetalleOrdenCompraRequest request);

    void eliminar(Long id);

    DetalleOrdenCompraResponse actualizarRecepcion(Long id, Double cantidadRecibida, Boolean recibidoCompleto);
}

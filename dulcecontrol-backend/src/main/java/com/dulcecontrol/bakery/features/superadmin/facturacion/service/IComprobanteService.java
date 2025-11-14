package com.dulcecontrol.bakery.features.superadmin.facturacion.service;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.ComprobanteResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.DetalleComprobanteResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoSunat;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.TipoComprobante;

import java.util.List;

public interface IComprobanteService {
    List<ComprobanteResponse> listar(Long tiendaId, EstadoSunat estadoSunat, TipoComprobante tipo);
    ComprobanteResponse obtener(Long id);
    List<DetalleComprobanteResponse> listarDetalles(Long comprobanteId);
}
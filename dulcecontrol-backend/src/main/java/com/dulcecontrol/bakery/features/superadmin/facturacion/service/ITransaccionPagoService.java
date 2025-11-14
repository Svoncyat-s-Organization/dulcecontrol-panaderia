package com.dulcecontrol.bakery.features.superadmin.facturacion.service;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.TransaccionPagoResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.entity.enums.EstadoTransaccion;

import java.util.List;

public interface ITransaccionPagoService {
    List<TransaccionPagoResponse> listar(Long comprobanteId, EstadoTransaccion estado);
    TransaccionPagoResponse obtener(Long id);
}
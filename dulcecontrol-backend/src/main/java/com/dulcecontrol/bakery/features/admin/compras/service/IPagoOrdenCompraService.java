package com.dulcecontrol.bakery.features.admin.compras.service;

import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraRequest;
import com.dulcecontrol.bakery.features.admin.compras.dto.PagoOrdenCompraResponse;

import java.util.List;

public interface IPagoOrdenCompraService {
    
    PagoOrdenCompraResponse registrarPago(PagoOrdenCompraRequest request);
    
    List<PagoOrdenCompraResponse> obtenerHistorialPagos(Long ordenCompraId);
    
    PagoOrdenCompraResponse obtenerPagoPorId(Long id);
}

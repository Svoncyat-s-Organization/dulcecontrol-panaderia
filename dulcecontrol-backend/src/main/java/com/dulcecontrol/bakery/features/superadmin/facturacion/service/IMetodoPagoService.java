package com.dulcecontrol.bakery.features.superadmin.facturacion.service;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.MetodoPagoResponse;

import java.util.List;

public interface IMetodoPagoService {
    List<MetodoPagoResponse> listar();

    MetodoPagoResponse obtener(Long id);

    MetodoPagoResponse crear(MetodoPagoRequest request);

    MetodoPagoResponse actualizar(Long id, MetodoPagoRequest request);

    void eliminar(Long id);
}

package com.dulcecontrol.bakery.feature.superadmin.facturacion.service;

import com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto.SerieCreateRequest;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto.SerieResponse;
import com.dulcecontrol.bakery.feature.superadmin.facturacion.controller.dto.SerieUpdateRequest;

import java.util.List;

public interface ISerieService {
    List<SerieResponse> listar();
    SerieResponse obtener(Integer id);
    SerieResponse crear(SerieCreateRequest request);
    SerieResponse actualizar(Integer id, SerieUpdateRequest request);
    void eliminar(Integer id);
}
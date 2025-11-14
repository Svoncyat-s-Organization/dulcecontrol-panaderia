package com.dulcecontrol.bakery.features.superadmin.facturacion.service;

import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieResponse;
import com.dulcecontrol.bakery.features.superadmin.facturacion.dto.SerieUpdateRequest;

import java.util.List;

public interface ISerieService {
    List<SerieResponse> listar();
    SerieResponse obtener(Integer id);
    SerieResponse crear(SerieCreateRequest request);
    SerieResponse actualizar(Integer id, SerieUpdateRequest request);
    void eliminar(Integer id);
}
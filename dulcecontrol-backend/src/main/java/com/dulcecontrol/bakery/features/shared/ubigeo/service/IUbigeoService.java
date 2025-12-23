package com.dulcecontrol.bakery.features.shared.ubigeo.service;

import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DepartamentoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.DistritoResponse;
import com.dulcecontrol.bakery.features.shared.ubigeo.dto.ProvinciaResponse;

import java.util.List;

public interface IUbigeoService {

    List<DepartamentoResponse> obtenerDepartamentos();

    List<ProvinciaResponse> obtenerProvinciasPorDepartamento(Long departamentoId);

    List<DistritoResponse> obtenerDistritosPorProvincia(Long provinciaId);

    DistritoResponse obtenerDistritoPorId(Long id);

    ProvinciaResponse obtenerProvinciaPorId(Long id);
}

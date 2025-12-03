package com.dulcecontrol.bakery.features.admin.ubigeo.service;

import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDepartamentoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoDistritoResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoProvinciaResponse;
import com.dulcecontrol.bakery.features.admin.ubigeo.dto.UbigeoRutaResponse;

import java.util.List;

public interface IUbigeoAdminService {

    List<UbigeoDepartamentoResponse> listarDepartamentos();

    List<UbigeoProvinciaResponse> listarProvinciasPorDepartamento(Long departamentoId);

    List<UbigeoDistritoResponse> listarDistritosPorProvincia(Long provinciaId);

    UbigeoRutaResponse obtenerRutaPorDistrito(Long distritoId);
}

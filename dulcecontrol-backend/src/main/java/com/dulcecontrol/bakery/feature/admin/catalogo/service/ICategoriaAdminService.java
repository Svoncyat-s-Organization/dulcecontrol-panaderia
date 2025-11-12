package com.dulcecontrol.bakery.feature.admin.catalogo.service;

import com.dulcecontrol.bakery.feature.admin.catalogo.controller.dto.CategoriaCreateRequest;
import com.dulcecontrol.bakery.feature.admin.catalogo.controller.dto.CategoriaResponse;
import com.dulcecontrol.bakery.feature.admin.catalogo.controller.dto.CategoriaUpdateRequest;

import java.util.List;

public interface ICategoriaAdminService {

    List<CategoriaResponse> listar(Long tiendaId);

    CategoriaResponse obtener(Long tiendaId, Long categoriaId);

    CategoriaResponse crear(Long tiendaId, CategoriaCreateRequest request);

    CategoriaResponse actualizar(Long tiendaId, Long categoriaId, CategoriaUpdateRequest request);

    void eliminar(Long tiendaId, Long categoriaId);
}

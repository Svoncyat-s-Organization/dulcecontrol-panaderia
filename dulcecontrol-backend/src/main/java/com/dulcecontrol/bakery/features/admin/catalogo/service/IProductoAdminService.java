package com.dulcecontrol.bakery.features.admin.catalogo.service;

import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoCreateRequest;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoResponse;
import com.dulcecontrol.bakery.features.admin.catalogo.dto.ProductoUpdateRequest;

import java.util.List;

public interface IProductoAdminService {

    List<ProductoResponse> listar(Long tiendaId, Long categoriaId);

    ProductoResponse obtener(Long tiendaId, Long productoId);

    ProductoResponse crear(Long tiendaId, ProductoCreateRequest request);

    ProductoResponse actualizar(Long tiendaId, Long productoId, ProductoUpdateRequest request);

    void eliminar(Long tiendaId, Long productoId);
}

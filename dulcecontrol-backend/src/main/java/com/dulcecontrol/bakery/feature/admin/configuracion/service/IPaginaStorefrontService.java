package com.dulcecontrol.bakery.feature.admin.configuracion.service;

import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontCreateRequest;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontResponse;
import com.dulcecontrol.bakery.feature.admin.configuracion.controller.dto.PaginaStorefrontUpdateRequest;

import java.util.List;

public interface IPaginaStorefrontService {

    List<PaginaStorefrontResponse> listarPorTienda(Long tiendaId);

    List<PaginaStorefrontResponse> buscarPorTiendaYTexto(Long tiendaId, String busqueda);

    PaginaStorefrontResponse obtenerPorId(Long tiendaId, Long paginaId);

    PaginaStorefrontResponse crear(Long tiendaId, PaginaStorefrontCreateRequest request);

    PaginaStorefrontResponse actualizar(Long tiendaId, Long paginaId, PaginaStorefrontUpdateRequest request);

    void eliminar(Long tiendaId, Long paginaId);
}
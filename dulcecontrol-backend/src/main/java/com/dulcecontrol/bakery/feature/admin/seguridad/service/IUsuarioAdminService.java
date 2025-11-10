package com.dulcecontrol.bakery.feature.admin.seguridad.service;

import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.UsuarioCreateRequest;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.UsuarioResponse;
import com.dulcecontrol.bakery.feature.admin.seguridad.controller.dto.UsuarioUpdateRequest;

import java.util.List;

public interface IUsuarioAdminService {

    List<UsuarioResponse> listarPorTienda(Long tiendaId);

    UsuarioResponse obtenerPorId(Long tiendaId, Long usuarioId);

    UsuarioResponse crear(Long tiendaId, UsuarioCreateRequest request);

    UsuarioResponse actualizar(Long tiendaId, Long usuarioId, UsuarioUpdateRequest request);

    void eliminar(Long tiendaId, Long usuarioId);
}

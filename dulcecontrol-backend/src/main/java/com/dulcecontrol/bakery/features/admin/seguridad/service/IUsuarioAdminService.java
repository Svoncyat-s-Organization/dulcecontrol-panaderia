package com.dulcecontrol.bakery.features.admin.seguridad.service;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioCreateRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioResponse;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioUpdateRequest;

import java.util.List;

public interface IUsuarioAdminService {

    List<UsuarioResponse> listarPorTienda(Long tiendaId);

    UsuarioResponse obtenerPorId(Long tiendaId, Long usuarioId);

    UsuarioResponse crear(Long tiendaId, UsuarioCreateRequest request);

    UsuarioResponse actualizar(Long tiendaId, Long usuarioId, UsuarioUpdateRequest request);

    void eliminar(Long tiendaId, Long usuarioId);
}

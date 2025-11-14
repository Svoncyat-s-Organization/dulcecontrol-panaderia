package com.dulcecontrol.bakery.features.superadmin.seguridad.service;

import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminCreateRequest;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminResponse;
import com.dulcecontrol.bakery.features.superadmin.seguridad.dto.UsuarioSuperadminUpdateRequest;

import java.util.List;

public interface IUsuarioSuperadminService {

    List<UsuarioSuperadminResponse> listar();

    UsuarioSuperadminResponse obtenerPorId(Long id);

    UsuarioSuperadminResponse crear(UsuarioSuperadminCreateRequest request);

    UsuarioSuperadminResponse actualizar(Long id, UsuarioSuperadminUpdateRequest request);

    void eliminar(Long id);
}

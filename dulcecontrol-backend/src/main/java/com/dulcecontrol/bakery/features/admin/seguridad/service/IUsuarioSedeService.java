package com.dulcecontrol.bakery.features.admin.seguridad.service;

import com.dulcecontrol.bakery.features.admin.seguridad.dto.AsignarSedesRequest;
import com.dulcecontrol.bakery.features.admin.seguridad.dto.UsuarioSedeResponse;

import java.util.List;

public interface IUsuarioSedeService {

    List<UsuarioSedeResponse> obtenerSedesPorUsuario(Long tiendaId, Long usuarioId);

    List<UsuarioSedeResponse> asignarSedes(Long tiendaId, Long usuarioId, AsignarSedesRequest request);

    void removerSede(Long tiendaId, Long usuarioId, Long sedeId);
}

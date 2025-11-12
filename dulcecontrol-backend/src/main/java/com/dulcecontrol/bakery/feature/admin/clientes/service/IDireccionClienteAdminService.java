package com.dulcecontrol.bakery.feature.admin.clientes.service;

import com.dulcecontrol.bakery.feature.admin.clientes.controller.dto.DireccionClienteCreateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.controller.dto.DireccionClienteResponse;
import com.dulcecontrol.bakery.feature.admin.clientes.controller.dto.DireccionClienteUpdateRequest;

import java.util.List;

public interface IDireccionClienteAdminService {

    List<DireccionClienteResponse> listarPorCliente(Long tiendaId, Long clienteId);

    DireccionClienteResponse obtenerPorId(Long tiendaId, Long clienteId, Long direccionId);

    DireccionClienteResponse crear(Long tiendaId, Long clienteId, DireccionClienteCreateRequest request);

    DireccionClienteResponse actualizar(Long tiendaId, Long clienteId, Long direccionId, DireccionClienteUpdateRequest request);

    void eliminar(Long tiendaId, Long clienteId, Long direccionId);
}
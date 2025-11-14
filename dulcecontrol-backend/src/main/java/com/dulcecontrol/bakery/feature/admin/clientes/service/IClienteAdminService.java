package com.dulcecontrol.bakery.feature.admin.clientes.service;

import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteCreateRequest;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteResponse;
import com.dulcecontrol.bakery.feature.admin.clientes.dto.ClienteUpdateRequest;

import java.util.List;

public interface IClienteAdminService {

    List<ClienteResponse> listarPorTienda(Long tiendaId);

    List<ClienteResponse> buscarPorTiendaYTexto(Long tiendaId, String busqueda);

    ClienteResponse obtenerPorId(Long tiendaId, Long clienteId);

    ClienteResponse crear(Long tiendaId, ClienteCreateRequest request);

    ClienteResponse actualizar(Long tiendaId, Long clienteId, ClienteUpdateRequest request);

    void eliminar(Long tiendaId, Long clienteId);
}
package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PedidoEntrega;

public interface IPedidoEntregaService {
    // CRUD para el API de PedidoEntrega

    List<PedidoEntrega> buscarTodos();
    // Método para listar todos los elementos de PedidoEntrega

    void guardar(PedidoEntrega pedidoEntrega);
    // Método para guardar PedidoEntrega

    void modificar(PedidoEntrega pedidoEntrega);
    // Método para modificar PedidoEntrega

    Optional<PedidoEntrega> buscarId(Long id);
    // Método para listar un pedidoEntrega

    void eliminar(Long id);
    // Método para eliminar un pedidoEntrega
}
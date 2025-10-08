package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Pedido;

public interface IPedidoService {
    // CRUD para el API de Pedido

    List<Pedido> buscarTodos();
    // Método para listar todos los elementos de Pedido

    void guardar(Pedido pedido);
    // Método para guardar Pedido

    void modificar(Pedido pedido);
    // Método para modificar Pedido

    Optional<Pedido> buscarId(Long id);
    // Método para listar un pedido

    void eliminar(Long id);
    // Método para eliminar un pedido
}
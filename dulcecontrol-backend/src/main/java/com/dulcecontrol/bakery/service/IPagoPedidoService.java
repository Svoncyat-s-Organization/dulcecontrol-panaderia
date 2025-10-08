package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PagoPedido;

public interface IPagoPedidoService {
    // CRUD para el API de PagoPedido

    List<PagoPedido> buscarTodos();
    // Método para listar todos los elementos de PagoPedido

    void guardar(PagoPedido pagoPedido);
    // Método para guardar PagoPedido

    void modificar(PagoPedido pagoPedido);
    // Método para modificar PagoPedido

    Optional<PagoPedido> buscarId(Long id);
    // Método para listar un pagoPedido

    void eliminar(Long id);
    // Método para eliminar un pagoPedido
}
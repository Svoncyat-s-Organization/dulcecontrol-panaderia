package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PedidoItem;

public interface IPedidoItemService {
    // CRUD para el API de PedidoItem

    List<PedidoItem> buscarTodos();
    // Método para listar todos los elementos de PedidoItem

    void guardar(PedidoItem pedidoItem);
    // Método para guardar PedidoItem

    void modificar(PedidoItem pedidoItem);
    // Método para modificar PedidoItem

    Optional<PedidoItem> buscarId(Long id);
    // Método para listar un pedidoItem

    void eliminar(Long id);
    // Método para eliminar un pedidoItem
}
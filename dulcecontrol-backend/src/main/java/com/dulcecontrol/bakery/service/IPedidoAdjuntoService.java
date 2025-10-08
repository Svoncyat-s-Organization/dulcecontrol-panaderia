package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PedidoAdjunto;

public interface IPedidoAdjuntoService {
    // CRUD para el API de PedidoAdjunto

    List<PedidoAdjunto> buscarTodos();
    // Método para listar todos los elementos de PedidoAdjunto

    void guardar(PedidoAdjunto pedidoAdjunto);
    // Método para guardar PedidoAdjunto

    void modificar(PedidoAdjunto pedidoAdjunto);
    // Método para modificar PedidoAdjunto

    Optional<PedidoAdjunto> buscarId(Long id);
    // Método para listar un pedidoAdjunto

    void eliminar(Long id);
    // Método para eliminar un pedidoAdjunto
}
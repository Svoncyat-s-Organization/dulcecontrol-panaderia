package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Compra;

public interface ICompraService {
    // CRUD para el API de Compra

    List<Compra> buscarTodos();
    // Método para listar todos los elementos de Compra

    void guardar(Compra compra);
    // Método para guardar Compra

    void modificar(Compra compra);
    // Método para modificar Compra

    Optional<Compra> buscarId(Long id);
    // Método para listar una compra

    void eliminar(Long id);
    // Método para eliminar una compra
}
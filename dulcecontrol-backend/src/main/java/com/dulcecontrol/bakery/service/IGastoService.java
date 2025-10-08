package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Gasto;

public interface IGastoService {
    // CRUD para el API de Gasto

    List<Gasto> buscarTodos();
    // Método para listar todos los elementos de Gasto

    void guardar(Gasto gasto);
    // Método para guardar Gasto

    void modificar(Gasto gasto);
    // Método para modificar Gasto

    Optional<Gasto> buscarId(Long id);
    // Método para listar un gasto

    void eliminar(Long id);
    // Método para eliminar un gasto
}
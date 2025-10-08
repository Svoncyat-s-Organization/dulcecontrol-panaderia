package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Sede;

public interface ISedeService {
    // CRUD para el API de Sede

    List<Sede> buscarTodos();
    // Método para listar todos los elementos de Sede

    void guardar(Sede cliente);
    // Método para guardar Sede

    void modificar(Sede cliente);
    // Método para modificar Sede

    Optional<Sede> buscarId(Integer id);
    // Método para listar un cliente

    void eliminar(Integer id);
    // Método para eliminar un cliente
}

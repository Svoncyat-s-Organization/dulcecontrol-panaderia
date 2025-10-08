package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.ConteoMatutino;

public interface IConteoMatutinoService {
    // CRUD para el API de ConteoMatutino

    List<ConteoMatutino> buscarTodos();
    // Método para listar todos los elementos de ConteoMatutino

    void guardar(ConteoMatutino conteoMatutino);
    // Método para guardar ConteoMatutino

    void modificar(ConteoMatutino conteoMatutino);
    // Método para modificar ConteoMatutino

    Optional<ConteoMatutino> buscarId(Long id);
    // Método para listar un conteoMatutino

    void eliminar(Long id);
    // Método para eliminar un conteoMatutino
}
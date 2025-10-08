package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.ConteoMatutinoItem;

public interface IConteoMatutinoItemService {
    // CRUD para el API de ConteoMatutinoItem

    List<ConteoMatutinoItem> buscarTodos();
    // Método para listar todos los elementos de ConteoMatutinoItem

    void guardar(ConteoMatutinoItem conteoMatutinoItem);
    // Método para guardar ConteoMatutinoItem

    void modificar(ConteoMatutinoItem conteoMatutinoItem);
    // Método para modificar ConteoMatutinoItem

    Optional<ConteoMatutinoItem> buscarId(Long id);
    // Método para listar un conteoMatutinoItem

    void eliminar(Long id);
    // Método para eliminar un conteoMatutinoItem
}
package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.RecetaItem;

public interface IRecetaItemService {
    // CRUD para el API de RecetaItem

    List<RecetaItem> buscarTodos();
    // Método para listar todos los elementos de RecetaItem

    void guardar(RecetaItem recetaItem);
    // Método para guardar RecetaItem

    void modificar(RecetaItem recetaItem);
    // Método para modificar RecetaItem

    Optional<RecetaItem> buscarId(Long id);
    // Método para listar un recetaItem

    void eliminar(Long id);
    // Método para eliminar un recetaItem
}
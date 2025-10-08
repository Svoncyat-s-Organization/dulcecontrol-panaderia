package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PlanProduccionItem;

public interface IPlanProduccionItemService {
    // CRUD para el API de PlanProduccionItem

    List<PlanProduccionItem> buscarTodos();
    // Método para listar todos los elementos de PlanProduccionItem

    void guardar(PlanProduccionItem planProduccionItem);
    // Método para guardar PlanProduccionItem

    void modificar(PlanProduccionItem planProduccionItem);
    // Método para modificar PlanProduccionItem

    Optional<PlanProduccionItem> buscarId(Long id);
    // Método para listar un planProduccionItem

    void eliminar(Long id);
    // Método para eliminar un planProduccionItem
}
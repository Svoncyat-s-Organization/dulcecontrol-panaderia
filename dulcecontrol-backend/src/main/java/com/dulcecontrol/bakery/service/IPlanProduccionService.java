package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PlanProduccion;

public interface IPlanProduccionService {
    // CRUD para el API de PlanProduccion

    List<PlanProduccion> buscarTodos();
    // Método para listar todos los elementos de PlanProduccion

    void guardar(PlanProduccion planProduccion);
    // Método para guardar PlanProduccion

    void modificar(PlanProduccion planProduccion);
    // Método para modificar PlanProduccion

    Optional<PlanProduccion> buscarId(Long id);
    // Método para listar un planProduccion

    void eliminar(Long id);
    // Método para eliminar un planProduccion
}
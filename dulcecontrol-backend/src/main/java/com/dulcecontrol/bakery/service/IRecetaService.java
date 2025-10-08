package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Receta;

public interface IRecetaService {
    // CRUD para el API de Receta

    List<Receta> buscarTodos();
    // Método para listar todos los elementos de Receta

    void guardar(Receta receta);
    // Método para guardar Receta

    void modificar(Receta receta);
    // Método para modificar Receta

    Optional<Receta> buscarId(Long id);
    // Método para listar una receta

    void eliminar(Long id);
    // Método para eliminar una receta
}
package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Insumo;

public interface IInsumoService {
    // CRUD para el API de Insumo

    List<Insumo> buscarTodos();
    // Método para listar todos los elementos de Insumo

    void guardar(Insumo insumo);
    // Método para guardar Insumo

    void modificar(Insumo insumo);
    // Método para modificar Insumo

    Optional<Insumo> buscarId(Long id);
    // Método para listar un insumo

    void eliminar(Long id);
    // Método para eliminar un insumo
}
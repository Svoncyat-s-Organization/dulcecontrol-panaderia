package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Registros;

public interface IRegistrosService {
    // CRUD para el API de Registros

    List<Registros> buscarTodos();
    // Método para listar todos los elementos de Registros

    void guardar(Registros registro);
    // Método para guardar registros

    void modificar(Registros registro);
    // Método para modificar registros

    Optional<Registros> buscarId(Integer id);
    // Método para listar un registro

    void eliminar(Integer id);
    // Método para eliminar un registro
}
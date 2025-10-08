package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Permiso;

public interface IPermisoService {
    // CRUD para el API de Permiso

    List<Permiso> buscarTodos();
    // Método para listar todos los elementos de Permiso

    void guardar(Permiso permiso);
    // Método para guardar Permiso

    void modificar(Permiso permiso);
    // Método para modificar Permiso

    Optional<Permiso> buscarId(Long id);
    // Método para listar un permiso

    void eliminar(Long id);
    // Método para eliminar un permiso
}
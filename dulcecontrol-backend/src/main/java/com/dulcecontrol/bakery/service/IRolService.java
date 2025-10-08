package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Rol;

public interface IRolService {
    // CRUD para el API de Rol

    List<Rol> buscarTodos();
    // Método para listar todos los elementos de Rol

    void guardar(Rol rol);
    // Método para guardar Rol

    void modificar(Rol rol);
    // Método para modificar Rol

    Optional<Rol> buscarId(Long id);
    // Método para listar un rol

    void eliminar(Long id);
    // Método para eliminar un rol
}
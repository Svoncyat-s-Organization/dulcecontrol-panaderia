package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Usuario;

public interface IUsuarioService {
    // CRUD para el API de Usuario

    List<Usuario> buscarTodos();
    // Método para listar todos los elementos de Usuario

    void guardar(Usuario usuario);
    // Método para guardar Usuario

    void modificar(Usuario usuario);
    // Método para modificar Usuario

    Optional<Usuario> buscarId(Long id);
    // Método para listar un usuario

    void eliminar(Long id);
    // Método para eliminar un usuario
}
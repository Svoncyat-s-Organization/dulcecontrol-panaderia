package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.UsuarioRecuperacion;

public interface IUsuarioRecuperacionService {
    // CRUD para el API de UsuarioRecuperacion

    List<UsuarioRecuperacion> buscarTodos();
    // Método para listar todos los elementos de UsuarioRecuperacion

    void guardar(UsuarioRecuperacion usuarioRecuperacion);
    // Método para guardar UsuarioRecuperacion

    void modificar(UsuarioRecuperacion usuarioRecuperacion);
    // Método para modificar UsuarioRecuperacion

    Optional<UsuarioRecuperacion> buscarId(Long id);
    // Método para listar un usuarioRecuperacion

    void eliminar(Long id);
    // Método para eliminar un usuarioRecuperacion
}
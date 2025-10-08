package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.UsuarioRol;
import com.dulcecontrol.bakery.entity.UsuarioRolId;

public interface IUsuarioRolService {
    // CRUD para el API de UsuarioRol

    List<UsuarioRol> buscarTodos();
    // Método para listar todos los elementos de UsuarioRol

    void guardar(UsuarioRol usuarioRol);
    // Método para guardar UsuarioRol

    void modificar(UsuarioRol usuarioRol);
    // Método para modificar UsuarioRol

    Optional<UsuarioRol> buscarId(UsuarioRolId id);
    // Método para listar un usuarioRol

    void eliminar(UsuarioRolId id);
    // Método para eliminar un usuarioRol
}
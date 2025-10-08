package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.UsuarioSede;
import com.dulcecontrol.bakery.entity.UsuarioSedeId;

public interface IUsuarioSedeService {
    // CRUD para el API de UsuarioSede

    List<UsuarioSede> buscarTodos();
    // Método para listar todos los elementos de UsuarioSede

    void guardar(UsuarioSede usuarioSede);
    // Método para guardar UsuarioSede

    void modificar(UsuarioSede usuarioSede);
    // Método para modificar UsuarioSede

    Optional<UsuarioSede> buscarId(UsuarioSedeId id);
    // Método para listar un usuarioSede

    void eliminar(UsuarioSedeId id);
    // Método para eliminar un usuarioSede
}
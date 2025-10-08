package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.RolPermiso;
import com.dulcecontrol.bakery.entity.RolPermisoId;

public interface IRolPermisoService {
    // CRUD para el API de RolPermiso

    List<RolPermiso> buscarTodos();
    // Método para listar todos los elementos de RolPermiso

    void guardar(RolPermiso rolPermiso);
    // Método para guardar RolPermiso

    void modificar(RolPermiso rolPermiso);
    // Método para modificar RolPermiso

    Optional<RolPermiso> buscarId(RolPermisoId id);
    // Método para listar un rolPermiso

    void eliminar(RolPermisoId id);
    // Método para eliminar un rolPermiso
}
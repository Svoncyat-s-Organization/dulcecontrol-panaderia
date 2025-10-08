package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.CajaSesion;

public interface ICajaSesionService {
    // CRUD para el API de CajaSesion

    List<CajaSesion> buscarTodos();
    // Método para listar todos los elementos de CajaSesion

    void guardar(CajaSesion cajaSesion);
    // Método para guardar CajaSesion

    void modificar(CajaSesion cajaSesion);
    // Método para modificar CajaSesion

    Optional<CajaSesion> buscarId(Long id);
    // Método para listar un cajaSesion

    void eliminar(Long id);
    // Método para eliminar un cajaSesion
}
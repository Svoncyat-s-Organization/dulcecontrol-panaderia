package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Proveedor;

public interface IProveedorService {
    // CRUD para el API de Proveedor

    List<Proveedor> buscarTodos();
    // Método para listar todos los elementos de Proveedor

    void guardar(Proveedor proveedor);
    // Método para guardar Proveedor

    void modificar(Proveedor proveedor);
    // Método para modificar Proveedor

    Optional<Proveedor> buscarId(Long id);
    // Método para listar un proveedor

    void eliminar(Long id);
    // Método para eliminar un proveedor
}
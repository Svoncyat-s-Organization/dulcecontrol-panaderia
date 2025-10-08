package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Producto;

public interface IProductoService {
    // CRUD para el API de Producto

    List<Producto> buscarTodos();
    // Método para listar todos los elementos de Producto

    void guardar(Producto producto);
    // Método para guardar Producto

    void modificar(Producto producto);
    // Método para modificar Producto

    Optional<Producto> buscarId(Long id);
    // Método para listar un producto

    void eliminar(Long id);
    // Método para eliminar un producto
}
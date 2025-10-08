package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.ProductoImagen;

public interface IProductoImagenService {
    // CRUD para el API de ProductoImagen

    List<ProductoImagen> buscarTodos();
    // Método para listar todos los elementos de ProductoImagen

    void guardar(ProductoImagen productoImagen);
    // Método para guardar ProductoImagen

    void modificar(ProductoImagen productoImagen);
    // Método para modificar ProductoImagen

    Optional<ProductoImagen> buscarId(Long id);
    // Método para listar un productoImagen

    void eliminar(Long id);
    // Método para eliminar un productoImagen
}
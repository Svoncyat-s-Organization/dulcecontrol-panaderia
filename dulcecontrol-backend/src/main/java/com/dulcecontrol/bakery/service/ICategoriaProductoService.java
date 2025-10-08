package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.CategoriaProducto;

public interface ICategoriaProductoService {
    // CRUD para el API de CategoriaProducto

    List<CategoriaProducto> buscarTodos();
    // Método para listar todos los elementos de CategoriaProducto

    void guardar(CategoriaProducto categoriaProducto);
    // Método para guardar CategoriaProducto

    void modificar(CategoriaProducto categoriaProducto);
    // Método para modificar CategoriaProducto

    Optional<CategoriaProducto> buscarId(Long id);
    // Método para listar una categoriaProducto

    void eliminar(Long id);
    // Método para eliminar una categoriaProducto
}
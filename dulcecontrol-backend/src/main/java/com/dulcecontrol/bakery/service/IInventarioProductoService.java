package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.InventarioProducto;
import com.dulcecontrol.bakery.entity.InventarioProductoId;

public interface IInventarioProductoService {
    // CRUD para el API de InventarioProducto

    List<InventarioProducto> buscarTodos();
    // Método para listar todos los elementos de InventarioProducto

    void guardar(InventarioProducto inventarioProducto);
    // Método para guardar InventarioProducto

    void modificar(InventarioProducto inventarioProducto);
    // Método para modificar InventarioProducto

    Optional<InventarioProducto> buscarId(InventarioProductoId id);
    // Método para listar un inventarioProducto

    void eliminar(InventarioProductoId id);
    // Método para eliminar un inventarioProducto
}
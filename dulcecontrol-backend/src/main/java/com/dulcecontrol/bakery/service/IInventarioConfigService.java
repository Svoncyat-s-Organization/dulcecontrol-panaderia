package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.InventarioConfig;
import com.dulcecontrol.bakery.entity.InventarioProductoId;

public interface IInventarioConfigService {
    // CRUD para el API de InventarioConfig

    List<InventarioConfig> buscarTodos();
    // Método para listar todos los elementos de InventarioConfig

    void guardar(InventarioConfig inventarioConfig);
    // Método para guardar InventarioConfig

    void modificar(InventarioConfig inventarioConfig);
    // Método para modificar InventarioConfig

    Optional<InventarioConfig> buscarId(InventarioProductoId id);
    // Método para listar un inventarioConfig

    void eliminar(InventarioProductoId id);
    // Método para eliminar un inventarioConfig
}
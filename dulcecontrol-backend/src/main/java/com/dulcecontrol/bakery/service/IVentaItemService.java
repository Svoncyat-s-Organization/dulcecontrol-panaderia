package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.VentaItem;

public interface IVentaItemService {
    // CRUD para el API de VentaItem

    List<VentaItem> buscarTodos();
    // Método para listar todos los elementos de VentaItem

    void guardar(VentaItem ventaItem);
    // Método para guardar VentaItem

    void modificar(VentaItem ventaItem);
    // Método para modificar VentaItem

    Optional<VentaItem> buscarId(Long id);
    // Método para listar un ventaItem

    void eliminar(Long id);
    // Método para eliminar un ventaItem
}
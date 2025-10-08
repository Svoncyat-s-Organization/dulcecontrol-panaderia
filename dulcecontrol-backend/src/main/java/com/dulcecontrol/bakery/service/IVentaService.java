package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Venta;

public interface IVentaService {
    // CRUD para el API de Venta

    List<Venta> buscarTodos();
    // Método para listar todos los elementos de Venta

    void guardar(Venta venta);
    // Método para guardar Venta

    void modificar(Venta venta);
    // Método para modificar Venta

    Optional<Venta> buscarId(Long id);
    // Método para listar un venta

    void eliminar(Long id);
    // Método para eliminar un venta
}
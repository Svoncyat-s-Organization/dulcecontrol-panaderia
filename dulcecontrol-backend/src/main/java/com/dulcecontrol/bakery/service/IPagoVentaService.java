package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.PagoVenta;

public interface IPagoVentaService {
    // CRUD para el API de PagoVenta

    List<PagoVenta> buscarTodos();
    // Método para listar todos los elementos de PagoVenta

    void guardar(PagoVenta pagoVenta);
    // Método para guardar PagoVenta

    void modificar(PagoVenta pagoVenta);
    // Método para modificar PagoVenta

    Optional<PagoVenta> buscarId(Long id);
    // Método para listar un pagoVenta

    void eliminar(Long id);
    // Método para eliminar un pagoVenta
}
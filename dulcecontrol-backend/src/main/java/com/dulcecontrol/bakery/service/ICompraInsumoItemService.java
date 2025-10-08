package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.CompraInsumoItem;

public interface ICompraInsumoItemService {
    // CRUD para el API de CompraInsumoItem

    List<CompraInsumoItem> buscarTodos();
    // Método para listar todos los elementos de CompraInsumoItem

    void guardar(CompraInsumoItem compraInsumoItem);
    // Método para guardar CompraInsumoItem

    void modificar(CompraInsumoItem compraInsumoItem);
    // Método para modificar CompraInsumoItem

    Optional<CompraInsumoItem> buscarId(Long id);
    // Método para listar un compraInsumoItem

    void eliminar(Long id);
    // Método para eliminar un compraInsumoItem
}
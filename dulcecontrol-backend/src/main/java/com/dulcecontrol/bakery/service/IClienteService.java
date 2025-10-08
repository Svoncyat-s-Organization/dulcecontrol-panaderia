package com.dulcecontrol.bakery.service;

import java.util.List;
import java.util.Optional;

import com.dulcecontrol.bakery.entity.Cliente;

public interface IClienteService {
    // CRUD para el API de Cliente

    List<Cliente> buscarTodos();
    // Método para listar todos los elementos de Cliente

    void guardar(Cliente cliente);
    // Método para guardar Cliente

    void modificar(Cliente cliente);
    // Método para modificar Cliente

    Optional<Cliente> buscarId(Long id);
    // Método para listar un cliente

    void eliminar(Long id);
    // Método para eliminar un cliente
}
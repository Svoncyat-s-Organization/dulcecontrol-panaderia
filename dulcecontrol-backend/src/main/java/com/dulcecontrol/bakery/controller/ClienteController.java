package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Cliente;
import com.dulcecontrol.bakery.service.IClienteService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ClienteController {
    @Autowired
    private IClienteService serviceCliente;

    @GetMapping("/cliente")
    public List<Cliente> buscartodos() {
        return serviceCliente.buscarTodos();
    }

    @PostMapping("/cliente")
    public Cliente guardar(@RequestBody Cliente cliente) {
        serviceCliente.guardar(cliente);
        return cliente;
    }

    @PutMapping("/cliente/{id}")
    public Cliente modificar(@RequestBody Cliente cliente) {
        serviceCliente.modificar(cliente);
        return cliente;
    }

    @GetMapping("/cliente/{id}")
    public Optional<Cliente> buscarId(@PathVariable("id") Long id) {
        return serviceCliente.buscarId(id);
    }

    @DeleteMapping("/cliente/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCliente.eliminar(id);
        return "Cliente eliminado";
    }
}
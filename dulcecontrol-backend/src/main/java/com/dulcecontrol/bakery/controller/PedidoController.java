package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Pedido;
import com.dulcecontrol.bakery.service.IPedidoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PedidoController {
    @Autowired
    private IPedidoService servicePedido;

    @GetMapping("/pedido")
    public List<Pedido> buscartodos() {
        return servicePedido.buscarTodos();
    }

    @PostMapping("/pedido")
    public Pedido guardar(@RequestBody Pedido pedido) {
        servicePedido.guardar(pedido);
        return pedido;
    }

    @PutMapping("/pedido/{id}")
    public Pedido modificar(@RequestBody Pedido pedido) {
        servicePedido.modificar(pedido);
        return pedido;
    }

    @GetMapping("/pedido/{id}")
    public Optional<Pedido> buscarId(@PathVariable("id") Long id) {
        return servicePedido.buscarId(id);
    }

    @DeleteMapping("/pedido/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePedido.eliminar(id);
        return "Pedido eliminado";
    }
}
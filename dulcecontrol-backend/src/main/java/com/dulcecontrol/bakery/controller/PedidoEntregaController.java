package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PedidoEntrega;
import com.dulcecontrol.bakery.service.IPedidoEntregaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PedidoEntregaController {
    @Autowired
    private IPedidoEntregaService servicePedidoEntrega;

    @GetMapping("/pedidoEntrega")
    public List<PedidoEntrega> buscartodos() {
        return servicePedidoEntrega.buscarTodos();
    }

    @PostMapping("/pedidoEntrega")
    public PedidoEntrega guardar(@RequestBody PedidoEntrega pedidoEntrega) {
        servicePedidoEntrega.guardar(pedidoEntrega);
        return pedidoEntrega;
    }

    @PutMapping("/pedidoEntrega/{id}")
    public PedidoEntrega modificar(@RequestBody PedidoEntrega pedidoEntrega) {
        servicePedidoEntrega.modificar(pedidoEntrega);
        return pedidoEntrega;
    }

    @GetMapping("/pedidoEntrega/{id}")
    public Optional<PedidoEntrega> buscarId(@PathVariable("id") Long id) {
        return servicePedidoEntrega.buscarId(id);
    }

    @DeleteMapping("/pedidoEntrega/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePedidoEntrega.eliminar(id);
        return "PedidoEntrega eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PagoPedido;
import com.dulcecontrol.bakery.service.IPagoPedidoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PagoPedidoController {
    @Autowired
    private IPagoPedidoService servicePagoPedido;

    @GetMapping("/pagoPedido")
    public List<PagoPedido> buscartodos() {
        return servicePagoPedido.buscarTodos();
    }

    @PostMapping("/pagoPedido")
    public PagoPedido guardar(@RequestBody PagoPedido pagoPedido) {
        servicePagoPedido.guardar(pagoPedido);
        return pagoPedido;
    }

    @PutMapping("/pagoPedido/{id}")
    public PagoPedido modificar(@RequestBody PagoPedido pagoPedido) {
        servicePagoPedido.modificar(pagoPedido);
        return pagoPedido;
    }

    @GetMapping("/pagoPedido/{id}")
    public Optional<PagoPedido> buscarId(@PathVariable("id") Long id) {
        return servicePagoPedido.buscarId(id);
    }

    @DeleteMapping("/pagoPedido/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagoPedido.eliminar(id);
        return "PagoPedido eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PedidoAdjunto;
import com.dulcecontrol.bakery.service.IPedidoAdjuntoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PedidoAdjuntoController {
    @Autowired
    private IPedidoAdjuntoService servicePedidoAdjunto;

    @GetMapping("/pedidoAdjunto")
    public List<PedidoAdjunto> buscartodos() {
        return servicePedidoAdjunto.buscarTodos();
    }

    @PostMapping("/pedidoAdjunto")
    public PedidoAdjunto guardar(@RequestBody PedidoAdjunto pedidoAdjunto) {
        servicePedidoAdjunto.guardar(pedidoAdjunto);
        return pedidoAdjunto;
    }

    @PutMapping("/pedidoAdjunto/{id}")
    public PedidoAdjunto modificar(@RequestBody PedidoAdjunto pedidoAdjunto) {
        servicePedidoAdjunto.modificar(pedidoAdjunto);
        return pedidoAdjunto;
    }

    @GetMapping("/pedidoAdjunto/{id}")
    public Optional<PedidoAdjunto> buscarId(@PathVariable("id") Long id) {
        return servicePedidoAdjunto.buscarId(id);
    }

    @DeleteMapping("/pedidoAdjunto/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePedidoAdjunto.eliminar(id);
        return "PedidoAdjunto eliminado";
    }
}
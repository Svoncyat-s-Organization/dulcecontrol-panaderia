package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PedidoItem;
import com.dulcecontrol.bakery.service.IPedidoItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PedidoItemController {
    @Autowired
    private IPedidoItemService servicePedidoItem;

    @GetMapping("/pedidoItem")
    public List<PedidoItem> buscartodos() {
        return servicePedidoItem.buscarTodos();
    }

    @PostMapping("/pedidoItem")
    public PedidoItem guardar(@RequestBody PedidoItem pedidoItem) {
        servicePedidoItem.guardar(pedidoItem);
        return pedidoItem;
    }

    @PutMapping("/pedidoItem/{id}")
    public PedidoItem modificar(@RequestBody PedidoItem pedidoItem) {
        servicePedidoItem.modificar(pedidoItem);
        return pedidoItem;
    }

    @GetMapping("/pedidoItem/{id}")
    public Optional<PedidoItem> buscarId(@PathVariable("id") Long id) {
        return servicePedidoItem.buscarId(id);
    }

    @DeleteMapping("/pedidoItem/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePedidoItem.eliminar(id);
        return "PedidoItem eliminado";
    }
}
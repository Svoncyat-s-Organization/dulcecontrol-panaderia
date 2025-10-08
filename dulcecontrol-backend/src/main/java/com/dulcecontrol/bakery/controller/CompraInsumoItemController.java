package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.CompraInsumoItem;
import com.dulcecontrol.bakery.service.ICompraInsumoItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class CompraInsumoItemController {
    @Autowired
    private ICompraInsumoItemService serviceCompraInsumoItem;

    @GetMapping("/compraInsumoItem")
    public List<CompraInsumoItem> buscartodos() {
        return serviceCompraInsumoItem.buscarTodos();
    }

    @PostMapping("/compraInsumoItem")
    public CompraInsumoItem guardar(@RequestBody CompraInsumoItem compraInsumoItem) {
        serviceCompraInsumoItem.guardar(compraInsumoItem);
        return compraInsumoItem;
    }

    @PutMapping("/compraInsumoItem/{id}")
    public CompraInsumoItem modificar(@RequestBody CompraInsumoItem compraInsumoItem) {
        serviceCompraInsumoItem.modificar(compraInsumoItem);
        return compraInsumoItem;
    }

    @GetMapping("/compraInsumoItem/{id}")
    public Optional<CompraInsumoItem> buscarId(@PathVariable("id") Long id) {
        return serviceCompraInsumoItem.buscarId(id);
    }

    @DeleteMapping("/compraInsumoItem/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCompraInsumoItem.eliminar(id);
        return "CompraInsumoItem eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Compra;
import com.dulcecontrol.bakery.service.ICompraService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class CompraController {
    @Autowired
    private ICompraService serviceCompra;

    @GetMapping("/compra")
    public List<Compra> buscartodos() {
        return serviceCompra.buscarTodos();
    }

    @PostMapping("/compra")
    public Compra guardar(@RequestBody Compra compra) {
        serviceCompra.guardar(compra);
        return compra;
    }

    @PutMapping("/compra/{id}")
    public Compra modificar(@RequestBody Compra compra) {
        serviceCompra.modificar(compra);
        return compra;
    }

    @GetMapping("/compra/{id}")
    public Optional<Compra> buscarId(@PathVariable("id") Long id) {
        return serviceCompra.buscarId(id);
    }

    @DeleteMapping("/compra/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCompra.eliminar(id);
        return "Compra eliminado";
    }
}
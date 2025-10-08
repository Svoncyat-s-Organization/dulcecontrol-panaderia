package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Producto;
import com.dulcecontrol.bakery.service.IProductoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ProductoController {
    @Autowired
    private IProductoService serviceProducto;

    @GetMapping("/producto")
    public List<Producto> buscartodos() {
        return serviceProducto.buscarTodos();
    }

    @PostMapping("/producto")
    public Producto guardar(@RequestBody Producto producto) {
        serviceProducto.guardar(producto);
        return producto;
    }

    @PutMapping("/producto/{id}")
    public Producto modificar(@RequestBody Producto producto) {
        serviceProducto.modificar(producto);
        return producto;
    }

    @GetMapping("/producto/{id}")
    public Optional<Producto> buscarId(@PathVariable("id") Long id) {
        return serviceProducto.buscarId(id);
    }

    @DeleteMapping("/producto/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceProducto.eliminar(id);
        return "Producto eliminado";
    }
}
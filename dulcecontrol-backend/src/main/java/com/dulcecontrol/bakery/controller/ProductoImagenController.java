package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.ProductoImagen;
import com.dulcecontrol.bakery.service.IProductoImagenService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ProductoImagenController {
    @Autowired
    private IProductoImagenService serviceProductoImagen;

    @GetMapping("/productoImagen")
    public List<ProductoImagen> buscartodos() {
        return serviceProductoImagen.buscarTodos();
    }

    @PostMapping("/productoImagen")
    public ProductoImagen guardar(@RequestBody ProductoImagen productoImagen) {
        serviceProductoImagen.guardar(productoImagen);
        return productoImagen;
    }

    @PutMapping("/productoImagen/{id}")
    public ProductoImagen modificar(@RequestBody ProductoImagen productoImagen) {
        serviceProductoImagen.modificar(productoImagen);
        return productoImagen;
    }

    @GetMapping("/productoImagen/{id}")
    public Optional<ProductoImagen> buscarId(@PathVariable("id") Long id) {
        return serviceProductoImagen.buscarId(id);
    }

    @DeleteMapping("/productoImagen/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceProductoImagen.eliminar(id);
        return "ProductoImagen eliminado";
    }
}
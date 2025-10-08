package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.CategoriaProducto;
import com.dulcecontrol.bakery.service.ICategoriaProductoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class CategoriaProductoController {
    @Autowired
    private ICategoriaProductoService serviceCategoriaProducto;

    @GetMapping("/categoriaProducto")
    public List<CategoriaProducto> buscartodos() {
        return serviceCategoriaProducto.buscarTodos();
    }

    @PostMapping("/categoriaProducto")
    public CategoriaProducto guardar(@RequestBody CategoriaProducto categoriaProducto) {
        serviceCategoriaProducto.guardar(categoriaProducto);
        return categoriaProducto;
    }

    @PutMapping("/categoriaProducto/{id}")
    public CategoriaProducto modificar(@RequestBody CategoriaProducto categoriaProducto) {
        serviceCategoriaProducto.modificar(categoriaProducto);
        return categoriaProducto;
    }

    @GetMapping("/categoriaProducto/{id}")
    public Optional<CategoriaProducto> buscarId(@PathVariable("id") Long id) {
        return serviceCategoriaProducto.buscarId(id);
    }

    @DeleteMapping("/categoriaProducto/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCategoriaProducto.eliminar(id);
        return "CategoriaProducto eliminado";
    }
}
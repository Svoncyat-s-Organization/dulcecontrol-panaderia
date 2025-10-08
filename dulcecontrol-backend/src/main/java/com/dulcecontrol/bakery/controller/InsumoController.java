package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Insumo;
import com.dulcecontrol.bakery.service.IInsumoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class InsumoController {
    @Autowired
    private IInsumoService serviceInsumo;

    @GetMapping("/insumo")
    public List<Insumo> buscartodos() {
        return serviceInsumo.buscarTodos();
    }

    @PostMapping("/insumo")
    public Insumo guardar(@RequestBody Insumo insumo) {
        serviceInsumo.guardar(insumo);
        return insumo;
    }

    @PutMapping("/insumo/{id}")
    public Insumo modificar(@RequestBody Insumo insumo) {
        serviceInsumo.modificar(insumo);
        return insumo;
    }

    @GetMapping("/insumo/{id}")
    public Optional<Insumo> buscarId(@PathVariable("id") Long id) {
        return serviceInsumo.buscarId(id);
    }

    @DeleteMapping("/insumo/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceInsumo.eliminar(id);
        return "Insumo eliminado";
    }
}
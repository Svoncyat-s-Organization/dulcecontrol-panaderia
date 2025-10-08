package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Receta;
import com.dulcecontrol.bakery.service.IRecetaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class RecetaController {
    @Autowired
    private IRecetaService serviceReceta;

    @GetMapping("/receta")
    public List<Receta> buscartodos() {
        return serviceReceta.buscarTodos();
    }

    @PostMapping("/receta")
    public Receta guardar(@RequestBody Receta receta) {
        serviceReceta.guardar(receta);
        return receta;
    }

    @PutMapping("/receta/{id}")
    public Receta modificar(@RequestBody Receta receta) {
        serviceReceta.modificar(receta);
        return receta;
    }

    @GetMapping("/receta/{id}")
    public Optional<Receta> buscarId(@PathVariable("id") Long id) {
        return serviceReceta.buscarId(id);
    }

    @DeleteMapping("/receta/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceReceta.eliminar(id);
        return "Receta eliminado";
    }
}
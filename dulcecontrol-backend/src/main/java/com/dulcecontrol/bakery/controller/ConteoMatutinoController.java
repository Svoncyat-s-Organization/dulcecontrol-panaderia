package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.ConteoMatutino;
import com.dulcecontrol.bakery.service.IConteoMatutinoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ConteoMatutinoController {
    @Autowired
    private IConteoMatutinoService serviceConteoMatutino;

    @GetMapping("/conteoMatutino")
    public List<ConteoMatutino> buscartodos() {
        return serviceConteoMatutino.buscarTodos();
    }

    @PostMapping("/conteoMatutino")
    public ConteoMatutino guardar(@RequestBody ConteoMatutino conteoMatutino) {
        serviceConteoMatutino.guardar(conteoMatutino);
        return conteoMatutino;
    }

    @PutMapping("/conteoMatutino/{id}")
    public ConteoMatutino modificar(@RequestBody ConteoMatutino conteoMatutino) {
        serviceConteoMatutino.modificar(conteoMatutino);
        return conteoMatutino;
    }

    @GetMapping("/conteoMatutino/{id}")
    public Optional<ConteoMatutino> buscarId(@PathVariable("id") Long id) {
        return serviceConteoMatutino.buscarId(id);
    }

    @DeleteMapping("/conteoMatutino/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceConteoMatutino.eliminar(id);
        return "ConteoMatutino eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Sede;
import com.dulcecontrol.bakery.service.ISedeService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class SedeController {
    @Autowired
    private ISedeService serviceSede;

    @GetMapping("/sede")
    public List<Sede> buscartodos() {
        return serviceSede.buscarTodos();
    }

    @PostMapping("/sede")
    public Sede guardar(@RequestBody Sede cliente) {
        serviceSede.guardar(cliente);
        return cliente;
    }

    @PutMapping("/sede/{id}")
    public Sede modificar(@RequestBody Sede cliente) {
        serviceSede.modificar(cliente);
        return cliente;
    }

    @GetMapping("/Sede/{id}")
    public Optional<Sede> buscarId(@PathVariable("id") Long id) {
        return serviceSede.buscarId(id);
    }

    @DeleteMapping("/Sede/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceSede.eliminar(id);
        return "Cliente eliminado";
    }
}

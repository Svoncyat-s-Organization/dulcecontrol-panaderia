package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Rol;
import com.dulcecontrol.bakery.service.IRolService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class RolController {
    @Autowired
    private IRolService serviceRol;

    @GetMapping("/rol")
    public List<Rol> buscartodos() {
        return serviceRol.buscarTodos();
    }

    @PostMapping("/rol")
    public Rol guardar(@RequestBody Rol rol) {
        serviceRol.guardar(rol);
        return rol;
    }

    @PutMapping("/rol/{id}")
    public Rol modificar(@RequestBody Rol rol) {
        serviceRol.modificar(rol);
        return rol;
    }

    @GetMapping("/rol/{id}")
    public Optional<Rol> buscarId(@PathVariable("id") Long id) {
        return serviceRol.buscarId(id);
    }

    @DeleteMapping("/rol/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceRol.eliminar(id);
        return "Rol eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Permiso;
import com.dulcecontrol.bakery.service.IPermisoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PermisoController {
    @Autowired
    private IPermisoService servicePermiso;

    @GetMapping("/permiso")
    public List<Permiso> buscartodos() {
        return servicePermiso.buscarTodos();
    }

    @PostMapping("/permiso")
    public Permiso guardar(@RequestBody Permiso permiso) {
        servicePermiso.guardar(permiso);
        return permiso;
    }

    @PutMapping("/permiso/{id}")
    public Permiso modificar(@RequestBody Permiso permiso) {
        servicePermiso.modificar(permiso);
        return permiso;
    }

    @GetMapping("/permiso/{id}")
    public Optional<Permiso> buscarId(@PathVariable("id") Long id) {
        return servicePermiso.buscarId(id);
    }

    @DeleteMapping("/permiso/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePermiso.eliminar(id);
        return "Permiso eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.UsuarioRecuperacion;
import com.dulcecontrol.bakery.service.IUsuarioRecuperacionService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class UsuarioRecuperacionController {
    @Autowired
    private IUsuarioRecuperacionService serviceUsuarioRecuperacion;

    @GetMapping("/usuarioRecuperacion")
    public List<UsuarioRecuperacion> buscartodos() {
        return serviceUsuarioRecuperacion.buscarTodos();
    }

    @PostMapping("/usuarioRecuperacion")
    public UsuarioRecuperacion guardar(@RequestBody UsuarioRecuperacion usuarioRecuperacion) {
        serviceUsuarioRecuperacion.guardar(usuarioRecuperacion);
        return usuarioRecuperacion;
    }

    @PutMapping("/usuarioRecuperacion/{id}")
    public UsuarioRecuperacion modificar(@RequestBody UsuarioRecuperacion usuarioRecuperacion) {
        serviceUsuarioRecuperacion.modificar(usuarioRecuperacion);
        return usuarioRecuperacion;
    }

    @GetMapping("/usuarioRecuperacion/{id}")
    public Optional<UsuarioRecuperacion> buscarId(@PathVariable("id") Long id) {
        return serviceUsuarioRecuperacion.buscarId(id);
    }

    @DeleteMapping("/usuarioRecuperacion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceUsuarioRecuperacion.eliminar(id);
        return "UsuarioRecuperacion eliminado";
    }
}
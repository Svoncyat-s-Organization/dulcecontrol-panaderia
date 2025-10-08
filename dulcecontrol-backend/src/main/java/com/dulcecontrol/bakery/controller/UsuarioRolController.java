package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.UsuarioRol;
import com.dulcecontrol.bakery.entity.UsuarioRolId;
import com.dulcecontrol.bakery.service.IUsuarioRolService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class UsuarioRolController {
    @Autowired
    private IUsuarioRolService serviceUsuarioRol;

    @GetMapping("/usuarioRol")
    public List<UsuarioRol> buscartodos() {
        return serviceUsuarioRol.buscarTodos();
    }

    @PostMapping("/usuarioRol")
    public UsuarioRol guardar(@RequestBody UsuarioRol usuarioRol) {
        serviceUsuarioRol.guardar(usuarioRol);
        return usuarioRol;
    }

    @PutMapping("/usuarioRol")
    public UsuarioRol modificar(@RequestBody UsuarioRol usuarioRol) {
        serviceUsuarioRol.modificar(usuarioRol);
        return usuarioRol;
    }

    @GetMapping("/usuarioRol/{usuarioId}/{rolId}")
    public Optional<UsuarioRol> buscarId(@PathVariable Long usuarioId, @PathVariable Long rolId) {
        UsuarioRolId id = new UsuarioRolId(usuarioId, rolId);
        return serviceUsuarioRol.buscarId(id);
    }

    @DeleteMapping("/usuarioRol/{usuarioId}/{rolId}")
    public String eliminar(@PathVariable Long usuarioId, @PathVariable Long rolId) {
        UsuarioRolId id = new UsuarioRolId(usuarioId, rolId);
        serviceUsuarioRol.eliminar(id);
        return "UsuarioRol eliminado";
    }
}
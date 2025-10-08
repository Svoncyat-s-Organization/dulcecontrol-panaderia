package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Usuario;
import com.dulcecontrol.bakery.service.IUsuarioService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class UsuarioController {
    @Autowired
    private IUsuarioService serviceUsuario;

    @GetMapping("/usuario")
    public List<Usuario> buscartodos() {
        return serviceUsuario.buscarTodos();
    }

    @PostMapping("/usuario")
    public Usuario guardar(@RequestBody Usuario usuario) {
        serviceUsuario.guardar(usuario);
        return usuario;
    }

    @PutMapping("/usuario/{id}")
    public Usuario modificar(@RequestBody Usuario usuario) {
        serviceUsuario.modificar(usuario);
        return usuario;
    }

    @GetMapping("/usuario/{id}")
    public Optional<Usuario> buscarId(@PathVariable("id") Long id) {
        return serviceUsuario.buscarId(id);
    }

    @DeleteMapping("/usuario/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceUsuario.eliminar(id);
        return "Usuario eliminado";
    }
}
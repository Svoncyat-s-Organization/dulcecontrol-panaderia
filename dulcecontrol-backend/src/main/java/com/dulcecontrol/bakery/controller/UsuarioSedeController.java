package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.UsuarioSede;
import com.dulcecontrol.bakery.entity.UsuarioSedeId;
import com.dulcecontrol.bakery.service.IUsuarioSedeService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class UsuarioSedeController {
    @Autowired
    private IUsuarioSedeService serviceUsuarioSede;

    @GetMapping("/usuarioSede")
    public List<UsuarioSede> buscartodos() {
        return serviceUsuarioSede.buscarTodos();
    }

    @PostMapping("/usuarioSede")
    public UsuarioSede guardar(@RequestBody UsuarioSede usuarioSede) {
        serviceUsuarioSede.guardar(usuarioSede);
        return usuarioSede;
    }

    @PutMapping("/usuarioSede")
    public UsuarioSede modificar(@RequestBody UsuarioSede usuarioSede) {
        serviceUsuarioSede.modificar(usuarioSede);
        return usuarioSede;
    }

    @GetMapping("/usuarioSede/{usuarioId}/{sedeId}")
    public Optional<UsuarioSede> buscarId(@PathVariable Long usuarioId, @PathVariable Long sedeId) {
        UsuarioSedeId id = new UsuarioSedeId(usuarioId, sedeId);
        return serviceUsuarioSede.buscarId(id);
    }

    @DeleteMapping("/usuarioSede/{usuarioId}/{sedeId}")
    public String eliminar(@PathVariable Long usuarioId, @PathVariable Long sedeId) {
        UsuarioSedeId id = new UsuarioSedeId(usuarioId, sedeId);
        serviceUsuarioSede.eliminar(id);
        return "UsuarioSede eliminado";
    }
}
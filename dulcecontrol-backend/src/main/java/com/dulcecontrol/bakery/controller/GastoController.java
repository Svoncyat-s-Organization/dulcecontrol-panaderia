package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Gasto;
import com.dulcecontrol.bakery.service.IGastoService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class GastoController {
    @Autowired
    private IGastoService serviceGasto;

    @GetMapping("/gasto")
    public List<Gasto> buscartodos() {
        return serviceGasto.buscarTodos();
    }

    @PostMapping("/gasto")
    public Gasto guardar(@RequestBody Gasto gasto) {
        serviceGasto.guardar(gasto);
        return gasto;
    }

    @PutMapping("/gasto/{id}")
    public Gasto modificar(@RequestBody Gasto gasto) {
        serviceGasto.modificar(gasto);
        return gasto;
    }

    @GetMapping("/gasto/{id}")
    public Optional<Gasto> buscarId(@PathVariable("id") Long id) {
        return serviceGasto.buscarId(id);
    }

    @DeleteMapping("/gasto/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceGasto.eliminar(id);
        return "Gasto eliminado";
    }
}
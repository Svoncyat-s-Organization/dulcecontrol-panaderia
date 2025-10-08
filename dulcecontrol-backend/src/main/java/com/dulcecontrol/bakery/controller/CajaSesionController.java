package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.CajaSesion;
import com.dulcecontrol.bakery.service.ICajaSesionService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class CajaSesionController {
    @Autowired
    private ICajaSesionService serviceCajaSesion;

    @GetMapping("/cajaSesion")
    public List<CajaSesion> buscartodos() {
        return serviceCajaSesion.buscarTodos();
    }

    @PostMapping("/cajaSesion")
    public CajaSesion guardar(@RequestBody CajaSesion cajaSesion) {
        serviceCajaSesion.guardar(cajaSesion);
        return cajaSesion;
    }

    @PutMapping("/cajaSesion/{id}")
    public CajaSesion modificar(@RequestBody CajaSesion cajaSesion) {
        serviceCajaSesion.modificar(cajaSesion);
        return cajaSesion;
    }

    @GetMapping("/cajaSesion/{id}")
    public Optional<CajaSesion> buscarId(@PathVariable("id") Long id) {
        return serviceCajaSesion.buscarId(id);
    }

    @DeleteMapping("/cajaSesion/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceCajaSesion.eliminar(id);
        return "CajaSesion eliminado";
    }
}
package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Proveedor;
import com.dulcecontrol.bakery.service.IProveedorService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class ProveedorController {
    @Autowired
    private IProveedorService serviceProveedor;

    @GetMapping("/proveedor")
    public List<Proveedor> buscartodos() {
        return serviceProveedor.buscarTodos();
    }

    @PostMapping("/proveedor")
    public Proveedor guardar(@RequestBody Proveedor proveedor) {
        serviceProveedor.guardar(proveedor);
        return proveedor;
    }

    @PutMapping("/proveedor/{id}")
    public Proveedor modificar(@RequestBody Proveedor proveedor) {
        serviceProveedor.modificar(proveedor);
        return proveedor;
    }

    @GetMapping("/proveedor/{id}")
    public Optional<Proveedor> buscarId(@PathVariable("id") Long id) {
        return serviceProveedor.buscarId(id);
    }

    @DeleteMapping("/proveedor/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceProveedor.eliminar(id);
        return "Proveedor eliminado";
    }
}
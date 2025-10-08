package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.Venta;
import com.dulcecontrol.bakery.service.IVentaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class VentaController {
    @Autowired
    private IVentaService serviceVenta;

    @GetMapping("/venta")
    public List<Venta> buscartodos() {
        return serviceVenta.buscarTodos();
    }

    @PostMapping("/venta")
    public Venta guardar(@RequestBody Venta venta) {
        serviceVenta.guardar(venta);
        return venta;
    }

    @PutMapping("/venta/{id}")
    public Venta modificar(@RequestBody Venta venta) {
        serviceVenta.modificar(venta);
        return venta;
    }

    @GetMapping("/venta/{id}")
    public Optional<Venta> buscarId(@PathVariable("id") Long id) {
        return serviceVenta.buscarId(id);
    }

    @DeleteMapping("/venta/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceVenta.eliminar(id);
        return "Venta eliminado";
    }
}
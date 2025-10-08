package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.PagoVenta;
import com.dulcecontrol.bakery.service.IPagoVentaService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class PagoVentaController {
    @Autowired
    private IPagoVentaService servicePagoVenta;

    @GetMapping("/pagoVenta")
    public List<PagoVenta> buscartodos() {
        return servicePagoVenta.buscarTodos();
    }

    @PostMapping("/pagoVenta")
    public PagoVenta guardar(@RequestBody PagoVenta pagoVenta) {
        servicePagoVenta.guardar(pagoVenta);
        return pagoVenta;
    }

    @PutMapping("/pagoVenta/{id}")
    public PagoVenta modificar(@RequestBody PagoVenta pagoVenta) {
        servicePagoVenta.modificar(pagoVenta);
        return pagoVenta;
    }

    @GetMapping("/pagoVenta/{id}")
    public Optional<PagoVenta> buscarId(@PathVariable("id") Long id) {
        return servicePagoVenta.buscarId(id);
    }

    @DeleteMapping("/pagoVenta/{id}")
    public String eliminar(@PathVariable Long id) {
        servicePagoVenta.eliminar(id);
        return "PagoVenta eliminado";
    }
}
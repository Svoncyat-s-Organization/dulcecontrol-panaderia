package com.dulcecontrol.bakery.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.dulcecontrol.bakery.entity.VentaItem;
import com.dulcecontrol.bakery.service.IVentaItemService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/restful")
public class VentaItemController {
    @Autowired
    private IVentaItemService serviceVentaItem;

    @GetMapping("/ventaItem")
    public List<VentaItem> buscartodos() {
        return serviceVentaItem.buscarTodos();
    }

    @PostMapping("/ventaItem")
    public VentaItem guardar(@RequestBody VentaItem ventaItem) {
        serviceVentaItem.guardar(ventaItem);
        return ventaItem;
    }

    @PutMapping("/ventaItem/{id}")
    public VentaItem modificar(@RequestBody VentaItem ventaItem) {
        serviceVentaItem.modificar(ventaItem);
        return ventaItem;
    }

    @GetMapping("/ventaItem/{id}")
    public Optional<VentaItem> buscarId(@PathVariable("id") Long id) {
        return serviceVentaItem.buscarId(id);
    }

    @DeleteMapping("/ventaItem/{id}")
    public String eliminar(@PathVariable Long id) {
        serviceVentaItem.eliminar(id);
        return "VentaItem eliminado";
    }
}